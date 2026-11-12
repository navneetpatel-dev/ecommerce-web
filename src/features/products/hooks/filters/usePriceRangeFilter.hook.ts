"use client";

import { useCallback, useId, useState } from "react";
import { LABELS } from "@/shared/constants/labels";

/**
 * The price fields as typed, applied to the listing only when they make a range.
 * Min above max used to go straight into the URL and show 0 products with no
 * reason given (B-19); now it shows an error and the listing keeps its last range.
 */
export function usePriceRangeFilter({
  minPrice,
  maxPrice,
  onUpdateFilter,
}: {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onUpdateFilter: (key: string, value: unknown) => void;
}) {
  const errorId = useId();
  const [draft, setDraft] = useState<{ min?: number; max?: number } | null>(
    null,
  );
  const min = draft ? draft.min : minPrice;
  const max = draft ? draft.max : maxPrice;
  const invalid = min !== undefined && max !== undefined && min > max;

  const apply = useCallback(
    (next: { min?: number; max?: number }) => {
      setDraft(next);
      if (
        next.min !== undefined &&
        next.max !== undefined &&
        next.min > next.max
      )
        return;
      onUpdateFilter("minPrice", next.min);
      onUpdateFilter("maxPrice", next.max);
    },
    [onUpdateFilter],
  );

  return {
    min,
    max,
    error: invalid ? LABELS.priceRangeInvalid : null,
    errorId,
    handleMinChange: (value: number | undefined) => apply({ min: value, max }),
    handleMaxChange: (value: number | undefined) => apply({ min, max: value }),
  };
}
