"use client";

import { useEffect, type RefObject } from "react";

/** Pressing "/" outside a text field opens the filters and focuses the search box. */
export function useFilterHotkey(
  enableHotkey: boolean,
  containerRef: RefObject<HTMLDivElement | null>,
  setIsOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (!enableHotkey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const activeTag = (target?.tagName || "").toLowerCase();
        const isEditable =
          activeTag === "input" ||
          activeTag === "textarea" ||
          activeTag === "select" ||
          Boolean(target?.isContentEditable);
        if (isEditable) return;

        if (
          !containerRef.current ||
          !document.body.contains(containerRef.current)
        ) {
          return;
        }

        e.preventDefault();
        setIsOpen(true);

        setTimeout(() => {
          const input = containerRef.current?.querySelector<HTMLInputElement>(
            'input[type="search"], input[id*="search"], input[placeholder*="search" i], input',
          );
          if (input) {
            input.focus();
            input.select?.();
          }
        }, 50);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableHotkey, containerRef, setIsOpen]);
}
