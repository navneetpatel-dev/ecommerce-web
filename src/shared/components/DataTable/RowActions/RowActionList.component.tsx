"use client";

import type { RowActionEntry } from "../../../types/data-table/rowActions.types";
import { rowActionsStyles as styles } from "../../../styles/data-table/rowActions.styles";
import {
  RowActionItem,
  type RowActionSelectHandler,
} from "./RowActionItem.component";

interface RowActionListProps {
  entries: RowActionEntry[];
  onSelect: RowActionSelectHandler;
}

export function RowActionList({ entries, onSelect }: RowActionListProps) {
  return (
    <div className={styles.list}>
      {entries.map((entry) => (
        <RowActionItem
          key={entry.id}
          entry={entry}
          variant="row"
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
