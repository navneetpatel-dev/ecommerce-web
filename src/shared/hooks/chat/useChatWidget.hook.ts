"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePublicSettings } from "@/shared/hooks/usePublicSettings.hook";

export function useChatWidget() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { data: settings } = usePublicSettings();

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Escape closes the panel and puts focus back on the bubble.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return {
    open,
    toggle: () => setOpen((value) => !value),
    close,
    triggerRef,
    supportHours: settings?.supportHours ?? null,
  };
}
