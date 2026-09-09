export function parseValue(raw: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function clamp(n: number, min?: number, max?: number) {
  let next = n;
  if (min != null && next < min) next = min;
  if (max != null && next > max) next = max;
  return next;
}
