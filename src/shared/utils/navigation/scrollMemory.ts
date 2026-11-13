import { STORAGE_KEYS } from "@/shared/constants/storage/storage";

/**
 * Where the visitor was on each page (by path + query), so Back/Forward lands
 * them where they left instead of at the top. Kept in sessionStorage (per tab,
 * survives a reload) and capped so it never grows without bound.
 */
const MAX_ENTRIES = 60;
let positions: Record<string, number> | null = null;
/** A Back/Forward mark is only meaningful for the route change it caused. */
const POP_WINDOW_MS = 1000;
let poppedAt = 0;
let preserveNext = false;

function load(): Record<string, number> {
  if (positions) return positions;
  try {
    const raw = window.sessionStorage.getItem(
      STORAGE_KEYS.ROUTE_SCROLL_POSITIONS,
    );
    positions = raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    positions = {};
  }
  return positions;
}

function persist() {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEYS.ROUTE_SCROLL_POSITIONS,
      JSON.stringify(positions ?? {}),
    );
  } catch {
    /* storage unavailable — memory only */
  }
}

export function rememberScroll(routeKey: string, y: number): void {
  const map = load();
  delete map[routeKey]; // re-insert so the newest entries survive the cap
  map[routeKey] = Math.max(0, Math.round(y));
  const keys = Object.keys(map);
  if (keys.length > MAX_ENTRIES) delete map[keys[0]!];
  persist();
}

export function recalledScroll(routeKey: string): number | null {
  const y = load()[routeKey];
  return typeof y === "number" && y > 0 ? y : null;
}

/** Set by the popstate listener: the next route change is Back/Forward. */
export function markPopNavigation(): void {
  poppedAt = Date.now();
}

export function takePopNavigation(): boolean {
  const recent = poppedAt > 0 && Date.now() - poppedAt < POP_WINDOW_MS;
  poppedAt = 0;
  return recent;
}

/**
 * The next URL change is in-page state (tab, filter) — keep the scroll where it
 * is instead of the reset-to-top a real navigation gets.
 */
export function preserveScrollOnNextNavigation(): void {
  preserveNext = true;
}

export function takePreserveScroll(): boolean {
  const was = preserveNext;
  preserveNext = false;
  return was;
}
