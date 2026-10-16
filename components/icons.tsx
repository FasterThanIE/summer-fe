import type { ReactElement, SVGProps } from "react";

type SvgProps = SVGProps<SVGSVGElement>;

const stroke = (width: number, joinRound = false): SvgProps => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: width,
  strokeLinecap: "round",
  ...(joinRound ? { strokeLinejoin: "round" as const } : {}),
});

const solid: SvgProps = { viewBox: "0 0 24 24", fill: "currentColor" };

const ICONS = {
  beach: (
    <svg {...stroke(2)}><path d="M3 19c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 6 0" /><path d="M12 15V5" /><path d="M4 9a8 8 0 0 1 16 0Z" /></svg>
  ),
  walk: (
    <svg {...stroke(2)}><circle cx="12" cy="5" r="2" /><path d="M10 22l1-7-3-2 2-5h4l2 5-3 2 1 7" /></svg>
  ),
  car: (
    <svg {...stroke(2)}><path d="M5 17h14l-1.5-6h-11Z" /><circle cx="8" cy="18" r="1.6" /><circle cx="16" cy="18" r="1.6" /><path d="M7 11l1.5-4h7L17 11" /></svg>
  ),
  wifi: (
    <svg {...stroke(2)}><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" /><circle cx="12" cy="19" r="1" fill="currentColor" /></svg>
  ),
  ac: (
    <svg {...stroke(2)}><path d="M12 2v20M4 6l16 12M20 6 4 18" /><path d="M9 3l3 2 3-2M9 21l3-2 3 2" /></svg>
  ),
  pool: (
    <svg {...stroke(2)}><path d="M2 18c2 1.3 3.5 1.3 5 0s3.5-1.3 5 0 3.5 1.3 5 0 3-1.3 5 0" /><path d="M8 15V5a2 2 0 0 1 4 0M16 14V5a2 2 0 0 0-4 0M8 9h8" /></svg>
  ),
  apartment: (
    <svg {...stroke(2, true)}><path d="M4 21V8l8-5 8 5v13" /><path d="M9 21v-6h6v6" /></svg>
  ),
  studio: (
    <svg {...stroke(2, true)}><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M3 13h18M7 7V5h10v2" /></svg>
  ),
  duplex: (
    <svg {...stroke(2, true)}><path d="M3 21V10l9-6 9 6v11Z" /><path d="M3 15h18M8 21v-3M16 12v-2" /></svg>
  ),
  clock: (
    <svg {...stroke(2, true)}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2M9 2h6" /></svg>
  ),
  boltOutline: (
    <svg {...stroke(2, true)}><path d="M13 2 4 14h7l-1 8 9-12h-7Z" /></svg>
  ),
  tag: (
    <svg {...stroke(2, true)}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
  ),
  heartOutline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></svg>
  ),
  pin: (
    <svg {...stroke(2.2)}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
  ),
  star: (
    <svg {...solid}><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z" /></svg>
  ),
  check: (
    <svg {...stroke(3, true)}><path d="m5 12 5 5 9-10" /></svg>
  ),
  bolt: (
    <svg {...solid}><path d="M13 2 4 14h7l-1 8 9-12h-7Z" /></svg>
  ),
  arrowRight: (
    <svg {...stroke(2.4, true)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  arrowLeft: (
    <svg {...stroke(2.2, true)}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
  ),
  chevronRight: (
    <svg {...stroke(2.4, true)}><path d="m9 6 6 6-6 6" /></svg>
  ),
  chevronLeft: (
    <svg {...stroke(2.4, true)}><path d="m15 6-6 6 6 6" /></svg>
  ),
  chevronDown: (
    <svg {...stroke(2.4, true)}><path d="m6 9 6 6 6-6" /></svg>
  ),
  moon: (
    <svg {...stroke(2.2)}><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" /></svg>
  ),
  users: (
    <svg {...stroke(2.2)}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-3-5.5" /></svg>
  ),
  calendar: (
    <svg {...stroke(2.2)}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
  ),
  wallet: (
    <svg {...stroke(2.2)}><path d="M4 7h15a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 19 20H5.5A1.5 1.5 0 0 1 4 18.5V7Zm0 0 12-3v3" /><circle cx="16" cy="13.5" r="1.2" fill="currentColor" /></svg>
  ),
  search: (
    <svg {...stroke(2.2)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
  ),
  menu: (
    <svg {...stroke(2.2)}><path d="M4 6h16M4 12h16M4 18h10" /></svg>
  ),
  sliders: (
    <svg {...stroke(2.2)}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
  ),
  bookmark: (
    <svg {...stroke(2.2, true)}><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1Z" /></svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
  ),
  share: (
    <svg {...stroke(2.2, true)}><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v14" /></svg>
  ),
  shield: (
    <svg {...stroke(2.4, true)}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  list: (
    <svg {...stroke(2.2)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
  ),
  mail: (
    <svg {...stroke(2.2, true)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  parking: (
    <svg {...stroke(2.2)}><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" /></svg>
  ),
  kitchen: (
    <svg {...stroke(2.2)}><path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 21V3c-2 0-3 2-3 5v5h3" /></svg>
  ),
  tv: (
    <svg {...stroke(2.2)}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M8 21h8M8 2l4 4 4-4" /></svg>
  ),
  sun: (
    <svg {...stroke(2.2)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  ),
  bed: (
    <svg {...stroke(2.2)}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="2" /></svg>
  ),
  sparkle: (
    <svg {...stroke(2.2, true)}><path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" /></svg>
  ),
} satisfies Record<string, ReactElement<SvgProps>>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const svg = ICONS[name];
  return <svg {...svg.props} className={className} aria-hidden="true" />;
}
