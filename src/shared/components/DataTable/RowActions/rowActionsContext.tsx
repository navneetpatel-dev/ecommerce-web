"use client";

import { createContext, type ReactNode } from "react";
import type { RowActionRegistry } from "../../../types/data-table/rowActions.types";

/** Set only inside a row menu; `RowActionButton` is an ordinary button elsewhere. */
export const RowActionsContext = createContext<RowActionRegistry | null>(null);

/** Stops a dialog opened from a row menu from feeding its own buttons back into that menu. */
export function RowActionsBoundary({ children }: { children: ReactNode }) {
  return (
    <RowActionsContext.Provider value={null}>
      {children}
    </RowActionsContext.Provider>
  );
}
