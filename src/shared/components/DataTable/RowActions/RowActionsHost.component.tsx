"use client";

import { useRef, type ReactNode, type SyntheticEvent } from "react";
import { useWarnStrayRowControls } from "../../../hooks/data-table/useWarnStrayRowControls.hook";
import type { RowActionRegistry } from "../../../types/data-table/rowActions.types";
import { RowActionsContext } from "./rowActionsContext";

interface RowActionsHostProps {
  registry: RowActionRegistry;
  children: ReactNode;
}

// Dialogs owned by an action are React descendants of this node: keep their events off the row.
const stopRowEvent = (event: SyntheticEvent) => event.stopPropagation();

/** Never visible. Keeps the action components, and the dialogs they own, mounted. */
export function RowActionsHost({ registry, children }: RowActionsHostProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  useWarnStrayRowControls(hostRef);

  return (
    <div
      ref={hostRef}
      hidden
      role="presentation"
      onClick={stopRowEvent}
      onKeyDown={stopRowEvent}
    >
      <RowActionsContext.Provider value={registry}>
        {children}
      </RowActionsContext.Provider>
    </div>
  );
}
