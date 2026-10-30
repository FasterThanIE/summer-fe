import "server-only";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, NoObjectGeneratedError, Output, type LanguageModelUsage } from "ai";
import { z } from "zod";
import { getAmenityNames } from "@/lib/accommodations";
import { laravelFetch, TooManyRequestsError } from "@/lib/laravel";
import { createAiSearchResultSchema } from "./filters";
import { createAiSearchInstructions } from "./instructions";
import { withoutDiacritics } from "./plain-text";
import type { EffectiveFilters, Interpretation, SearchFilters, SearchResponse, SearchSort } from "./types";

const DEFAULT_MODEL = "gpt-5.6-luna";
const MAX_ERROR_LENGTH = 5000;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const attemptResponseSchema = z.object({ id: z.number() });

export function todayInSerbia(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: process.env.APP_TIMEZONE || "Europe/Belgrade" }).format(new Date());
}

function withoutControlCharacters<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/[\u0000-\u001f\u007f]/g, "") as T;
  }

  if (Array.isArray(value)) {
    return value.map(withoutControlCharacters) as T;
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withoutControlCharacters(item)])) as T;
  }

  return value;
}

function withUpcomingCheckIn(checkIn: SearchFilters["check_in"], today: string): SearchFilters["check_in"] {
  if (!checkIn || !ISO_DATE.test(checkIn.from) || !ISO_DATE.test(checkIn.to) || checkIn.to >= today) {
    return checkIn;
  }

  const thisYear = Number(today.slice(0, 4));
  const upcomingYear = `${thisYear}${checkIn.to.slice(4)}` < today ? thisYear + 1 : thisYear;
  const years = upcomingYear - Number(checkIn.to.slice(0, 4));
  const moved = (date: string) => `${Number(date.slice(0, 4)) + years}${date.slice(4)}`;

  return { ...checkIn, from: moved(checkIn.from), to: moved(checkIn.to) };
}

export async function interpretQuery(text: string, today: string): Promise<Interpretation> {
  const apiKey = process.env.CHATGPT_SECRET;
  const model = process.env.CHATGPT_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    console.error("AI search: CHATGPT_SECRET is missing in .env");
    throw new Error("AI pretraga nije podešena.");
  }

  let amenityNames: string[];
  try {
    amenityNames = await getAmenityNames();
  } catch (error) {
    console.error("AI search: amenities could not be loaded from Laravel", error);
    throw new Error("Pretraga trenutno ne radi.");
  }

  const databaseNameOf = new Map(amenityNames.map((name) => [withoutDiacritics(name), name]));
  const [firstAmenityName, ...otherAmenityNames] = [...databaseNameOf.keys()];

  if (firstAmenityName === undefined) {
    console.error("AI search: there are no amenities in the database, run the seeders");
    throw new Error("AI pretraga nije podešena.");
  }

  const attemptId = await recordAiSearchAttempt(text, model);

  try {
    const openai = createOpenAI({ apiKey, baseURL: process.env.CHATGPT_API_URL });
    const { output, totalUsage } = await generateText({
      model: openai(model),
      instructions: createAiSearchInstructions(today),
      prompt: text,
      output: Output.object({ schema: createAiSearchResultSchema([firstAmenityName, ...otherAmenityNames]) }),
    });
    await recordAiSearchUsage(attemptId, totalUsage, output, null);

    const filters = {
      ...output.data,
      check_in: withUpcomingCheckIn(output.data.check_in, today),
      amenities:
        output.data.amenities?.map((amenity) => ({ ...amenity, name: databaseNameOf.get(amenity.name) ?? amenity.name })) ?? null,
    };

    return withoutControlCharacters({ filters, errors: output.errors, notices: output.notices });
  } catch (error) {
    await recordAiSearchUsage(attemptId, NoObjectGeneratedError.isInstance(error) ? error.usage : undefined, null, errorReason(error));

    console.error("AI search: OpenAI request failed", error);
    throw new Error("AI pretraga trenutno ne radi.");
  }
}

async function recordAiSearchAttempt(text: string, model: string): Promise<number> {
  let response;
  try {
    response = await laravelFetch("/ai-search-attempts", { method: "POST", body: { text, model }, isInternal: true });
  } catch (error) {
    console.error("AI search: Laravel is not reachable", error);
    throw new Error("Pretraga trenutno ne radi.");
  }

  if (response.status === 429) {
    throw new TooManyRequestsError(response);
  }

  if (!response.ok) {
    console.error("AI search: Laravel rejected the attempt", response.status);
    throw new Error("Pretraga trenutno ne radi.");
  }

  return attemptResponseSchema.parse(await response.json()).id;
}

function errorReason(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error && error.cause instanceof Error ? ` ${error.cause.message}` : "";

  return `${message}${cause}`.replace(/sk-[\w*.-]+/g, "[key]").slice(0, MAX_ERROR_LENGTH);
}

async function recordAiSearchUsage(attemptId: number, usage: LanguageModelUsage | undefined, answer: object | null, error: string | null): Promise<void> {
  const cachedTokens = usage?.inputTokenDetails.cacheReadTokens ?? 0;

  try {
    const response = await laravelFetch(`/ai-search-attempts/${attemptId}`, {
      method: "PATCH",
      isInternal: true,
      body: {
        answer,
        error,
        input_tokens: (usage?.inputTokens ?? 0) - cachedTokens,
        cached_tokens: cachedTokens,
        output_tokens: usage?.outputTokens ?? 0,
        reasoning_tokens: usage?.outputTokenDetails.reasoningTokens ?? 0,
      },
    });

    if (!response.ok) {
      console.error("AI search: Laravel rejected the usage", response.status);
    }
  } catch (error) {
    console.error("AI search: usage could not be saved", error);
  }
}

export async function searchAccommodations(
  filters: EffectiveFilters,
  page: number,
  sort: SearchSort,
): Promise<SearchResponse> {
  const body = {
    ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== null)),
    page,
    sort,
  };

  let response;
  try {
    response = await laravelFetch("/search", { method: "POST", body });
  } catch (error) {
    console.error("AI search: Laravel is not reachable", error);
    throw new Error("Pretraga trenutno ne radi.");
  }

  if (response.status === 429) {
    throw new TooManyRequestsError(response);
  }

  const result = await response.json();

  if (!response.ok) {
    console.error("AI search: Laravel rejected the filters", response.status, result);
    throw new Error("Pretraga trenutno ne radi.");
  }

  return result as SearchResponse;
}
