"use client";

import { useState, type ChangeEvent } from "react";

/**
 * Open/close + reason state for `ReasonPromptDialog` consumers — the in-app
 * replacement for `window.prompt`. The owning hook performs the mutation on
 * submit and calls `cancel()` once it succeeds.
 */
export function useReasonPrompt() {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const openFor = (id: string) => {
    setReason("");
    setTargetId(id);
  };

  const cancel = () => setTargetId(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) cancel();
  };

  const handleReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  return {
    open: targetId !== null,
    targetId,
    reason,
    openFor,
    cancel,
    handleOpenChange,
    handleReasonChange,
  };
}
