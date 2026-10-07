"use client";

import { useEffect, type RefObject } from "react";

/** Every focusable element inside the overlay, in DOM order. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface UseModalOverlayParams {
  open: boolean;
  onClose: () => void;
  /** Panel that receives focus and traps Tab while the overlay is open. */
  panelRef: RefObject<HTMLElement | null>;
  /**
   * Control to focus when the panel opens. Defaults to the first focusable in
   * DOM order — pass this when that default is not the safe landing spot.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Modal behaviour for hand-rolled overlays: Escape closes, focus moves into the
 * panel on open and is trapped inside it, focus returns to the trigger on
 * close, and the page behind is scroll-locked. Radix primitives (ui/dialog,
 * ui/select, ui/popover) already do this themselves — use this hook only for
 * overlays built from plain elements.
 */
export function useModalOverlay({
  open,
  onClose,
  panelRef,
  initialFocusRef,
}: UseModalOverlayParams) {
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      );

    (initialFocusRef?.current ?? focusables()[0])?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const isOutside = !panel || !active || !panel.contains(active);

      if (event.shiftKey && (active === first || isOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || isOutside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose, panelRef, initialFocusRef]);
}
