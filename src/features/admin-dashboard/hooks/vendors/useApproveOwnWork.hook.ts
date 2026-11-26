"use client";

import { useState } from "react";
import { ADMIN_NOTE_LIMITS } from "@/features/products";

interface Options {
  onConfirm: (reason: string) => Promise<unknown>;
}

/** The reason a Super Admin gives for approving a listing they prepared themselves. */
export function useApproveOwnWork({ onConfirm }: Options) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const canConfirm = reason.trim().length >= ADMIN_NOTE_LIMITS.MIN && !busy;

  const confirm = async () => {
    if (!canConfirm) return;
    setBusy(true);
    try {
      await onConfirm(reason.trim());
      setReason("");
    } finally {
      setBusy(false);
    }
  };

  return { reason, setReason, busy, canConfirm, confirm };
}
