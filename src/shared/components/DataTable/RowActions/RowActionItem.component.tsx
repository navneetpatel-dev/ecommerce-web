"use client";

import type { MouseEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { cn } from "@/shared/utils/dom/cn";
import type { RowActionEntry } from "../../../types/data-table/rowActions.types";
import { rowActionsStyles as styles } from "../../../styles/data-table/rowActions.styles";

export type RowActionSelectHandler = (
  entry: RowActionEntry,
  event: MouseEvent<HTMLButtonElement>,
) => void;

interface RowActionItemProps {
  entry: RowActionEntry;
  variant: "tile" | "row";
  onSelect: RowActionSelectHandler;
}

export function RowActionItem({
  entry,
  variant,
  onSelect,
}: RowActionItemProps) {
  const Icon = entry.loading ? LoaderCircle : entry.icon;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
    onSelect(entry, event);

  const button = (
    <button
      type="button"
      data-row-action={entry.kind}
      className={cn(
        variant === "tile" ? styles.tile : styles.row,
        variant === "row" && entry.kind === "danger" && styles.rowDanger,
        entry.attentionClassName,
      )}
      disabled={entry.disabled || entry.loading}
      aria-busy={entry.loading || undefined}
      aria-label={entry.ariaLabel}
      aria-haspopup={entry.ariaHasPopup}
      onClick={handleClick}
    >
      <Icon
        className={entry.loading ? styles.spinner : undefined}
        strokeWidth={2}
        aria-hidden
      />
      <span>{entry.label}</span>
    </button>
  );

  if (!entry.disabled || !entry.disabledHint) return button;

  return (
    <DisabledActionHint disabled message={entry.disabledHint} block>
      {button}
    </DisabledActionHint>
  );
}
