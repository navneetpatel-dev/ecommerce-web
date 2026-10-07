"use client";

import { useEffect, type RefObject } from "react";

/**
 * Global shortcut into the header search input: Cmd/Ctrl+K from anywhere, or
 * "/" while not typing in a field. No-ops when no header input is mounted
 * (mobile shows search via the tab bar instead).
 */
export function useSearchHotkey(inputRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typingInsideField =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const isCommandK =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const isSlash = event.key === "/" && !typingInsideField;
      if (!isCommandK && !isSlash) return;

      const input = inputRef.current;
      if (!input) return;
      event.preventDefault();
      input.focus();
      input.select();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [inputRef]);
}
