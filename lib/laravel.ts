import "server-only";
import { headers } from "next/headers";
import { countWord } from "@/lib/ai-search/present";

const API_PREFIX = "/api/v1";

type LaravelFetchOptions = { method?: "GET" | "POST" | "PATCH"; body?: object; isInternal?: boolean };

export async function laravelFetch(path: string, options: LaravelFetchOptions = {}): Promise<Response> {
  const clientIp = (await headers()).get("x-forwarded-for")?.split(",").at(-1)?.trim();

  return fetch(`${process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000"}${API_PREFIX}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      ...(options.isInternal ? { "X-Internal-Key": process.env.INTERNAL_API_KEY ?? "" } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

export class TooManyRequestsError extends Error {
  readonly retryAfterSeconds: number | null;

  constructor(response: Response) {
    const seconds = Number.parseInt(response.headers.get("Retry-After") ?? "", 10);
    const retryAfterSeconds = Number.isInteger(seconds) && seconds > 0 ? seconds : null;

    super(`Poslato je previše pretraga. Pokušaj ponovo za ${waitText(retryAfterSeconds)}.`);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function waitText(seconds: number | null): string {
  if (seconds === null) {
    return "par trenutaka";
  }

  if (seconds < 60) {
    return `${seconds} ${countWord(seconds, "sekundu", "sekunde", "sekundi")}`;
  }

  if (seconds < 3600) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} ${countWord(minutes, "minut", "minuta", "minuta")}`;
  }

  const hours = Math.ceil(seconds / 3600);
  return `${hours} ${countWord(hours, "sat", "sata", "sati")}`;
}
