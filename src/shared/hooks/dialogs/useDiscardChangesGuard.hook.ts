"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Confirm-before-discard for dialogs holding unsaved edits. `useUnsavedChanges`
 * only blocks browser unload; a dialog close (Escape, backdrop, Cancel) needs
 * its own confirmation — this hook is that confirmation's state machine.
 *
 * Wrap every user-initiated close path in `requestClose(performClose)`, and
 * render the paired DiscardChangesDialog with the returned props. Programmatic
 * closes (e.g. after a successful save) must call their own close directly so
 * they are not intercepted.
 */
export function useDiscardChangesGuard(isDirty: boolean) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingCloseRef = useRef<(() => void) | null>(null);

  const requestClose = useCallback(
    (performClose: () => void) => {
      if (!isDirty) {
        performClose();
        return;
      }
      pendingCloseRef.current = performClose;
      setConfirmOpen(true);
    },
    [isDirty],
  );

  const confirmDiscard = useCallback(() => {
    const performClose = pendingCloseRef.current;
    pendingCloseRef.current = null;
    setConfirmOpen(false);
    performClose?.();
  }, []);

  const cancelDiscard = useCallback(() => {
    pendingCloseRef.current = null;
    setConfirmOpen(false);
  }, []);

  const handleConfirmOpenChange = useCallback(
    (open: boolean) => {
      if (!open) cancelDiscard();
    },
    [cancelDiscard],
  );

  return {
    confirmOpen,
    requestClose,
    confirmDiscard,
    cancelDiscard,
    handleConfirmOpenChange,
  };
}
