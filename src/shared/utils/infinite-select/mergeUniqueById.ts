export interface IdentifiedOption {
  id: string;
}

/**
 * Merges fetched option pages, dropping duplicates by id (pure util — Rule 1).
 * Shared by both infinite-select variants.
 */
export function mergeUniqueById<T extends IdentifiedOption>(
  existing: T[],
  incoming: T[],
): T[] {
  if (incoming.length === 0) return existing;
  const seen = new Set(existing.map((item) => item.id));
  const next = [...existing];
  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}
