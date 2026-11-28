"use client";

import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import {
  taxApi,
  type MrpImpact,
  type TaxRuleChange,
} from "../../api/tax/tax.api";

/** What the change being considered would take off sale; null until known (or with none). */
export function useTaxRuleImpact(
  change: TaxRuleChange | null,
): MrpImpact | null {
  const key = useDebouncedValue(change ? JSON.stringify(change) : "", 400);
  const [loaded, setLoaded] = useState<{
    key: string;
    impact: MrpImpact;
  } | null>(null);

  useEffect(() => {
    if (!key) return;
    let active = true;
    taxApi
      .impact(JSON.parse(key) as TaxRuleChange)
      .then((impact) => {
        if (active) setLoaded({ key, impact });
      })
      // The preview is advice: saving is never blocked by it.
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [key]);

  return key && loaded?.key === key ? loaded.impact : null;
}
