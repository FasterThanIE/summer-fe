import type { SidebarDates } from "@/lib/ai-search/types";

const pad = (number: number) => String(number).padStart(2, "0");

export function toIso(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromIso(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLabel(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

export function arrivalLabel({ from, to }: SidebarDates): string {
  if (from && to) {
    return from === to ? toLabel(from) : `${toLabel(from)} – ${toLabel(to)}`;
  }

  return from ? `od ${toLabel(from)}` : to ? `do ${toLabel(to)}` : "";
}

export function parseArrival(text: string): SidebarDates | null {
  if (text.trim() === "") {
    return { from: null, to: null };
  }

  const days = [...text.matchAll(/(\d{1,2})\.(\d{1,2})\.(\d{4})/g)].map(([, day, month, year]) => {
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.getDate() === Number(day) && date.getMonth() === Number(month) - 1 ? toIso(date) : null;
  });

  if (days.length === 0 || days.length > 2 || days.some((day) => day === null)) {
    return null;
  }

  const [first, second] = days as string[];

  if (second) {
    return { from: first, to: second };
  }

  const start = text.trim().toLowerCase();

  if (start.startsWith("od")) {
    return { from: first, to: null };
  }

  return start.startsWith("do") ? { from: null, to: first } : { from: first, to: first };
}
