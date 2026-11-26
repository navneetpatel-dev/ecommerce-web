"use client";

import { useState } from "react";
import type { CategoryOptionData } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { taxApi, type EffectiveTaxRule } from "../../api/tax/tax.api";

/** "Where does this category's GST come from?": the rate it gets and the rule behind it. */
export function useTaxEffectiveLookup() {
  const [category, setCategory] = useState<CategoryOptionData | null>(null);
  const [result, setResult] = useState<EffectiveTaxRule | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectCategory = async (picked: CategoryOptionData) => {
    setCategory(picked);
    setError(null);
    try {
      setResult(await taxApi.effective(picked.id));
    } catch (err: unknown) {
      setResult(null);
      setError(getApiErrorMessage(err, LABELS.unexpectedError));
    }
  };
  const clear = () => {
    setCategory(null);
    setResult(null);
    setError(null);
  };

  const sourceText = !result
    ? null
    : result.source === "own"
      ? LABELS.taxSourceOwn
      : result.source === "inherited"
        ? formatLabel(LABELS.taxSourceInherited, {
            name: result.fromCategoryName ?? "",
          })
        : result.source === "default"
          ? LABELS.taxSourceDefault
          : LABELS.taxSourceFallback;

  return { category, result, error, sourceText, selectCategory, clear };
}
