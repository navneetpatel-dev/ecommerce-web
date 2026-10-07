"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Collects rapid writes (filter inputs) into one debounced flush. Every queued
 * key merges into the same write set, so editing two fields inside one window
 * applies both — unlike a shared debounced callback, where the later call
 * cancels the earlier one and silently drops the first field.
 *
 * `""` and `null` queue as `undefined` (a delete) so cleared inputs can pass
 * straight through. Queued keys are applied via the latest `apply` reference,
 * which lets callers merge onto fresher state than the render they queued in.
 */
export function useDebouncedWriteQueue(
  apply: (writes: Record<string, unknown>) => void,
  delay: number,
) {
  const applyRef = useRef(apply);
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    applyRef.current = apply;
  }, [apply]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const writes = pendingRef.current;
    if (Object.keys(writes).length === 0) return;
    pendingRef.current = {};
    applyRef.current(writes);
  }, []);

  const queue = useCallback(
    (key: string, value: unknown) => {
      pendingRef.current[key] =
        value === "" || value === null ? undefined : value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flush, delay);
    },
    [flush, delay],
  );

  /** Supersedes queued writes so a pending timer cannot apply them later. */
  const clear = useCallback(() => {
    pendingRef.current = {};
  }, []);

  return { queue, flushNow: flush, clear };
}
