"use client";

import { useCallback, useEffect, useRef } from "react";

export interface UseLongPressActionParams {
  /** Fire when the press is held longer than `delayMs`. */
  onLongPress: () => void;
  delayMs: number;
}

/**
 * Arms a one-shot long-press timer for the current pointer press. Call
 * `armLongPress` on pointer-down and `cancelLongPress` on movement beyond the
 * drag threshold or on release/cancel. The timer never fires after unmount
 * (Rule 14 cleanup).
 */
export function useLongPressAction(params: UseLongPressActionParams) {
  const { onLongPress, delayMs } = params;
  const timerRef = useRef<number | null>(null);
  const onLongPressRef = useRef(onLongPress);

  useEffect(() => {
    onLongPressRef.current = onLongPress;
  }, [onLongPress]);

  useEffect(
    () => () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const cancelLongPress = useCallback(() => {
    if (timerRef.current == null) return;
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const armLongPress = useCallback(() => {
    cancelLongPress();
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      onLongPressRef.current();
    }, delayMs);
  }, [cancelLongPress, delayMs]);

  return { armLongPress, cancelLongPress };
}
