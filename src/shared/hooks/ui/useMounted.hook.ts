"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after the client has hydrated. Use to gate anything that must not
 * diverge between the server render and the first client render (localStorage
 * reads, time-of-day output). Implemented with `useSyncExternalStore` so no
 * mount-flag effect (rule: set-state-in-effect) is needed.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
