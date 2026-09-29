"use client";

import { ArrowUpDown, Columns2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  mobileActionBarStyles as styles,
  type MobileActionBarVariant,
} from "@/shared/styles/listing/mobileActionBar.styles";

interface MobileActionBarProps {
  compareMode: boolean;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  onToggleCompareMode: () => void;
  /** Search results are relevance-ranked and can't be re-sorted. */
  sortDisabled?: boolean;
  /** Spacing density; the listing pages differ here by design. */
  variant?: MobileActionBarVariant;
}

/**
 * The filters / sort / compare bar above a mobile listing. One implementation
 * for both listing surfaces — they had drifted, so the category page's Sort
 * button ignored the "can't re-sort search results" state the product page
 * honoured.
 */
export function MobileActionBar({
  compareMode,
  onOpenFilters,
  onOpenSort,
  onToggleCompareMode,
  sortDisabled = false,
  variant = "comfortable",
}: MobileActionBarProps) {
  const label = (text: string) =>
    variant === "dense" ? (
      <span className={styles.buttonText}>{text}</span>
    ) : (
      text
    );

  return (
    <div className={styles.root[variant]}>
      <div className={styles.row[variant]}>
        <Button
          variant="secondary"
          size="sm"
          className={styles.button[variant]}
          onClick={onOpenFilters}
        >
          <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
          {label(LABELS.filters)}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className={styles.button[variant]}
          onClick={onOpenSort}
          disabled={sortDisabled}
          title={sortDisabled ? LABELS.sortUnavailableDuringSearch : undefined}
        >
          <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
          {label(LABELS.sort)}
        </Button>
        <Button
          variant={compareMode ? "default" : "secondary"}
          size="sm"
          className={styles.button[variant]}
          onClick={onToggleCompareMode}
          aria-pressed={compareMode}
        >
          <Columns2 size={14} strokeWidth={1.75} aria-hidden />
          {label(LABELS.compare)}
        </Button>
      </div>
    </div>
  );
}
