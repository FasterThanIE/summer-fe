import "server-only";
import { z } from "zod";
import { interpretQuery, todayInSerbia } from "@/lib/ai-search/search";
import { TooManyRequestsError } from "@/lib/laravel";

const MAX_TEXT_LENGTH = 1000;

const requestSchema = z.object({ text: z.string().trim().min(1).max(MAX_TEXT_LENGTH) });

export async function POST(request: Request) {
  const body = requestSchema.safeParse(await request.json().catch(() => null));

  if (!body.success) {
    const tooLong = body.error.issues.some((issue) => issue.code === "too_big");
    const message = tooLong ? `Tekst pretrage je predugačak (najviše ${MAX_TEXT_LENGTH} znakova).` : "Unesite tekst pretrage.";
    return Response.json({ message }, { status: 422 });
  }

  try {
    return Response.json(await interpretQuery(body.data.text, todayInSerbia()));
  } catch (error) {
    if (error instanceof TooManyRequestsError) {
      const headers = error.retryAfterSeconds === null ? undefined : { "Retry-After": String(error.retryAfterSeconds) };
      return Response.json({ message: error.message }, { status: 429, headers });
    }

    return Response.json({ message: error instanceof Error ? error.message : "AI pretraga trenutno ne radi." }, { status: 502 });
  }
}
