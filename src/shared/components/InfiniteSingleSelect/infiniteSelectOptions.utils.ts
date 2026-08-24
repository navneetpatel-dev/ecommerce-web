import type { InfiniteSingleSelectOption } from "./types";

/**
 * Merges fetched option pages, dropping duplicates by id (pure util — Rule 1).
 */
export function mergeUnique(
  existing: InfiniteSingleSelectOption[],
  incoming: InfiniteSingleSelectOption[],
): InfiniteSingleSelectOption[] {
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

export interface MergePinnedArgs {
  previous: InfiniteSingleSelectOption[];
  incoming: InfiniteSingleSelectOption[];
  replace: boolean;
  pinnedOption: InfiniteSingleSelectOption | null;
  /** Active search text; the pinned option must match it to stay visible. */
  query: string;
}

/**
 * Produces the next options list for a loaded page, keeping a pinned option
 * (e.g. the currently-selected entity from another page) at the top when it
 * is not part of the result and matches the active search filter.
 */
export function mergePageOptions(
  args: MergePinnedArgs,
): InfiniteSingleSelectOption[] {
  const { previous, incoming, replace, pinnedOption, query } = args;
  const merged = replace ? incoming : mergeUnique(previous, incoming);
  if (
    pinnedOption?.id &&
    !merged.some((item) => item.id === pinnedOption.id) &&
    (!query || pinnedOption.label.toLowerCase().includes(query.toLowerCase()))
  ) {
    return [pinnedOption, ...merged];
  }
  return merged;
}
