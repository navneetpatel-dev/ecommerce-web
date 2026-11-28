"use client";

import { useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  categoriesApi,
  type CategoryRateChange,
  type CategoryRateImpact,
} from "@/features/categories";
import { ADMIN_NOTE_LIMITS } from "@/features/products";

/**
 * What a reassignment or new parent would charge vendor products differently, and the written
 * reason the API asks for when it would. `change` is null while there is nothing to check.
 */
export function useCategoryRateImpact(change: CategoryRateChange | null) {
  const key = change ? JSON.stringify(change) : "";
  const [loaded, setLoaded] = useState<{
    key: string;
    impact: CategoryRateImpact | null;
  } | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!key) return;
    let active = true;
    const store = (impact: CategoryRateImpact | null) => {
      if (active) setLoaded({ key, impact });
    };
    // A failed check does not block saving: the API enforces the rule either way.
    categoriesApi
      .rateImpact(JSON.parse(key) as CategoryRateChange)
      .then(store)
      .catch(() => store(null));
    return () => {
      active = false;
    };
  }, [key]);

  const impact = key && loaded?.key === key ? loaded.impact : null;
  const affected = (impact?.productCount ?? 0) > 0;
  const blockedVendors = impact?.blockedVendors ?? [];
  const notAllowed = affected && !impact?.canApply;
  const blocked = notAllowed || blockedVendors.length > 0;
  const required = affected && !blocked;

  const onChange = (next: string) => {
    setValue(next);
    setError(undefined);
  };

  /** The reason to send: undefined when none is needed, null when it is missing (shown). */
  const takeReason = (): string | undefined | null => {
    if (!required) return undefined;
    const text = value.trim();
    if (text.length >= ADMIN_NOTE_LIMITS.MIN) return text;
    setError(LABELS.priceChangeReasonRequired);
    return null;
  };

  return {
    impact,
    affected,
    blocked,
    notAllowed,
    blockedVendors,
    checking: Boolean(key) && loaded?.key !== key,
    reason: { required, value, error, onChange },
    takeReason,
  };
}

export type CategoryRates = ReturnType<typeof useCategoryRateImpact>;
