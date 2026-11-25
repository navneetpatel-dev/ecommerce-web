"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Reads initial filter values from URL search params and tracks local user edits,
 * so deep links like `?search=Food&status=ACTIVE` populate inputs and queries
 * immediately while allowing instant clearing/typing.
 */
export function useUrlFilterParams<K extends string>(
  aliases?: Partial<Record<K, readonly string[]>>,
) {
  const searchParams = useSearchParams();
  const [overrides, setOverrides] = useState<Partial<Record<K, string>>>({});

  const get = useCallback(
    (key: K): string => {
      if (key in overrides && overrides[key] !== undefined) {
        return overrides[key] as string;
      }
      const direct = searchParams?.get(key);
      if (direct != null) return direct;
      const alts = aliases?.[key];
      if (alts) {
        for (const alt of alts) {
          const v = searchParams?.get(alt);
          if (v != null) return v;
        }
      }
      return "";
    },
    [overrides, searchParams, aliases],
  );

  const set = useCallback(
    (key: K) => (value: string) =>
      setOverrides((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const clearAll = useCallback((keys: readonly K[]) => {
    const next: Partial<Record<K, string>> = {};
    for (const k of keys) next[k] = "";
    setOverrides(next);
  }, []);

  return { get, set, clearAll };
}
