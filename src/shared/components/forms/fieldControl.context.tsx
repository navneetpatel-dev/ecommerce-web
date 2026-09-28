"use client";

import { createContext, useContext, type ReactNode } from "react";

export interface FieldControlWiring {
  /** id the surrounding frame's <Label htmlFor> points at. */
  controlId: string;
  /** Space-joined hint + error ids, when the frame renders either. */
  describedById?: string;
  /** True while the frame renders an error — controls must report aria-invalid. */
  invalid: boolean;
}

const FieldControlContext = createContext<FieldControlWiring | null>(null);

export function FieldControlProvider({
  value,
  children,
}: {
  value: FieldControlWiring;
  children: ReactNode;
}) {
  return (
    <FieldControlContext.Provider value={value}>
      {children}
    </FieldControlContext.Provider>
  );
}

/** Wiring published by the nearest FormFieldFrame, or null outside one. */
export function useFieldControl(): FieldControlWiring | null {
  return useContext(FieldControlContext);
}

/**
 * Merge an explicit `aria-*` id list with the frame's own, keeping both.
 * Returns `undefined` (not "") so React omits the attribute entirely.
 */
export function joinAriaIds(
  explicit: string | undefined,
  fromFrame: string | undefined,
): string | undefined {
  const merged = [explicit, fromFrame].filter(Boolean).join(" ");
  return merged || undefined;
}
