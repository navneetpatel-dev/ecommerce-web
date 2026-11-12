"use client";

import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";

interface MegaMenuKeyboardOptions {
  open: boolean;
  menuId: string;
  onToggle: () => void;
  onClose: () => void;
}

/**
 * Keyboard access to the Categories panel (B-14): ArrowDown on the button opens it and
 * moves into the first link; Up/Down step through the links, Home/End jump to the ends;
 * Escape closes it and returns focus to the button. Tabbing out still closes it.
 */
export function useMegaMenuKeyboard({
  open,
  menuId,
  onToggle,
  onClose,
}: MegaMenuKeyboardOptions) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const focusFirstOnOpen = useRef(false);

  const links = () =>
    Array.from(
      document
        .getElementById(menuId)
        ?.querySelectorAll<HTMLElement>("a[href]") ?? [],
    );

  useEffect(() => {
    if (!open || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    links()[0]?.focus();
  });

  const moveFocus = (step: number | "first" | "last") => {
    const items = links();
    if (!items.length) return;
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      step === "first"
        ? 0
        : step === "last"
          ? items.length - 1
          : (current + step + items.length) % items.length;
    items[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const onTrigger = event.target === triggerRef.current;
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      onClose();
      triggerRef.current?.focus();
      return;
    }
    if (event.key === "ArrowDown" && onTrigger) {
      event.preventDefault();
      if (open) moveFocus("first");
      else {
        focusFirstOnOpen.current = true;
        onToggle();
      }
      return;
    }
    if (!open || onTrigger) return;
    const keys: Record<string, number | "first" | "last"> = {
      ArrowDown: 1,
      ArrowUp: -1,
      Home: "first",
      End: "last",
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    moveFocus(keys[event.key]!);
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!open) return;
    if (event.currentTarget.contains(event.relatedTarget as Node | null))
      return;
    onClose();
  };

  return { triggerRef, handleKeyDown, handleBlur };
}
