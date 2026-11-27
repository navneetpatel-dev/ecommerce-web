"use client";

import { LABELS } from "@/shared/constants/labels";
import type { RowActionEntry } from "../../../types/data-table/rowActions.types";
import { arrangeRowActions } from "../../../utils/data-table/arrangeRowActions";
import { rowActionsStyles as styles } from "../../../styles/data-table/rowActions.styles";
import type { RowActionSelectHandler } from "./RowActionItem.component";
import { RowActionTiles } from "./RowActionTiles.component";
import { RowActionList } from "./RowActionList.component";

interface RowActionsPanelProps {
  entries: RowActionEntry[];
  onSelect: RowActionSelectHandler;
}

export function RowActionsPanel({ entries, onSelect }: RowActionsPanelProps) {
  const { tiles, list } = arrangeRowActions(entries);

  if (entries.length === 0) {
    return <p className={styles.empty}>{LABELS.noRowActions}</p>;
  }

  return (
    <>
      {tiles.length > 0 ? (
        <RowActionTiles entries={tiles} onSelect={onSelect} />
      ) : null}
      {tiles.length > 0 && list.length > 0 ? (
        <div role="separator" className={styles.divider} />
      ) : null}
      {list.length > 0 ? (
        <RowActionList entries={list} onSelect={onSelect} />
      ) : null}
    </>
  );
}
