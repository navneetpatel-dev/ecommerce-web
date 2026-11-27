"use client";

import { useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import type { RowActionEntry } from "../../types/data-table/rowActions.types";
import { createRowActionRegistry } from "../../utils/data-table/rowActionRegistry";

/**
 * State for one row ⋮ menu. The action components live in a hidden host that outlives the
 * popover after a selection, so the dialogs and spinners they own survive the menu closing.
 */
export function useRowActionsMenu() {
  const [registry] = useState(createRowActionRegistry);
  const entries = useSyncExternalStore(
    registry.subscribe,
    registry.getSnapshot,
    registry.getSnapshot,
  );
  const [open, setOpen] = useState(false);
  const [retained, setRetained] = useState(false);
  const [session, setSession] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closingBySelectionRef = useRef(false);
  const busy = entries.some((entry) => entry.loading);

  const handleOpenChange = (next: boolean) => {
    // A fresh open starts the actions over, unless one is still running.
    if (next && !busy) {
      setSession((value) => value + 1);
      setRetained(false);
    }
    setOpen(next);
  };

  const handleSelect = (
    entry: RowActionEntry,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (entry.disabled || entry.loading) return;
    closingBySelectionRef.current = true;
    setRetained(true);
    // Focus the ⋮ button before the action runs: a dialog it opens returns focus here.
    triggerRef.current?.focus({ preventScroll: true });
    setOpen(false);
    entry.run(event);
  };

  const handleCloseAutoFocus = (event: Event) => {
    if (!closingBySelectionRef.current) return;
    // The popover must not pull focus back out of the dialog that just opened.
    event.preventDefault();
    closingBySelectionRef.current = false;
  };

  return {
    registry,
    entries,
    open,
    busy,
    session,
    hostMounted: open || retained || busy,
    triggerRef,
    handleOpenChange,
    handleSelect,
    handleCloseAutoFocus,
  };
}
