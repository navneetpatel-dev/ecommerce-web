"use client";

import { useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  taxApi,
  type EffectiveTaxRule,
  type TaxRuleRow,
} from "../../api/tax/tax.api";

type Loaded =
  | { key: string; kind: "notFound" }
  | {
      key: string;
      kind: "ready";
      effective: EffectiveTaxRule;
      ownRule: TaxRuleRow | null;
    };

/**
 * The category the Tax page was opened for (`?categoryId=`): the rate it gets, where that comes from,
 * and its own rule when it has one. `version` re-reads it after a rule is saved or deleted.
 */
export function useTaxCategoryFocus(categoryId: string, version: number) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    let active = true;
    Promise.all([
      taxApi.effective(categoryId),
      taxApi.getRules({ categoryId, limit: 1 }),
    ])
      .then(([effective, rules]) => {
        if (active) {
          setLoaded({
            key: categoryId,
            kind: "ready",
            effective,
            ownRule: rules.items[0] ?? null,
          });
        }
      })
      .catch(() => {
        if (active) setLoaded({ key: categoryId, kind: "notFound" });
      });
    return () => {
      active = false;
    };
  }, [categoryId, version]);

  // Only what was loaded for the current category counts (no flash of the previous one).
  const current = loaded && loaded.key === categoryId ? loaded : null;
  const status = !categoryId
    ? "idle"
    : !current
      ? "loading"
      : current.kind === "notFound"
        ? "notFound"
        : "ready";
  const state = { status, ...(current?.kind === "ready" ? current : {}) } as {
    status: "idle" | "loading" | "notFound" | "ready";
    effective?: EffectiveTaxRule;
    ownRule?: TaxRuleRow | null;
  };

  const effective = state.effective ?? null;
  const sourceText = !effective
    ? ""
    : effective.source === "own"
      ? LABELS.taxSourceOwn
      : effective.source === "inherited"
        ? formatLabel(LABELS.taxSourceInherited, {
            name: effective.fromCategoryName ?? "",
          })
        : effective.source === "default"
          ? LABELS.taxSourceDefault
          : LABELS.taxSourceFallback;

  return {
    status: state.status,
    effective,
    ownRule: state.ownRule ?? null,
    sourceText,
  };
}
