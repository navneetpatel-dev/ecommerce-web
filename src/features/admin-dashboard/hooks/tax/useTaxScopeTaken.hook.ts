"use client";

import { useEffect, useState } from "react";
import { taxApi } from "../../api/tax/tax.api";

/**
 * Does another rule already cover the chosen scope (this category, or the platform default)?
 * Looked up as the category changes, so the conflict is shown before saving, not after.
 */
export function useTaxScopeTaken(scopeKey: string, ownRuleId?: string) {
  const [taken, setTaken] = useState<{ key: string; byOther: boolean } | null>(
    null,
  );
  useEffect(() => {
    let active = true;
    taxApi
      .getRules(
        scopeKey
          ? { categoryId: scopeKey, limit: 1 }
          : { scope: "default", limit: 1 },
      )
      .then((result) => {
        const existing = result.items[0];
        if (active) {
          setTaken({
            key: scopeKey,
            byOther: Boolean(existing && existing.id !== ownRuleId),
          });
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [scopeKey, ownRuleId]);
  return taken?.key === scopeKey && taken.byOther;
}
