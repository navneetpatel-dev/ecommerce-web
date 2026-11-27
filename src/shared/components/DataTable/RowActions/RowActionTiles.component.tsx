"use client";

import type { RowActionEntry } from "../../../types/data-table/rowActions.types";
import { rowActionsStyles as styles } from "../../../styles/data-table/rowActions.styles";
import {
  RowActionItem,
  type RowActionSelectHandler,
} from "./RowActionItem.component";

interface RowActionTilesProps {
  entries: RowActionEntry[];
  onSelect: RowActionSelectHandler;
}

export function RowActionTiles({ entries, onSelect }: RowActionTilesProps) {
  return (
    <div className={entries.length > 1 ? styles.tiles : styles.tilesSingle}>
      {entries.map((entry) => (
        <RowActionItem
          key={entry.id}
          entry={entry}
          variant="tile"
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
