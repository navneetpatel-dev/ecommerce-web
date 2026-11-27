import type { RowActionEntry } from "../../types/data-table/rowActions.types";

export interface ArrangedRowActions {
  /** At most one View and one Edit, in that order. */
  tiles: RowActionEntry[];
  /** Everything else, destructive actions last. */
  list: RowActionEntry[];
}

export function arrangeRowActions(
  entries: RowActionEntry[],
): ArrangedRowActions {
  const view = entries.find((entry) => entry.kind === "view");
  const edit = entries.find((entry) => entry.kind === "edit");
  const tiles = [view, edit].filter((entry): entry is RowActionEntry =>
    Boolean(entry),
  );
  const rest = entries.filter((entry) => !tiles.includes(entry));

  return {
    tiles,
    list: [
      ...rest.filter((entry) => entry.kind !== "danger"),
      ...rest.filter((entry) => entry.kind === "danger"),
    ],
  };
}
