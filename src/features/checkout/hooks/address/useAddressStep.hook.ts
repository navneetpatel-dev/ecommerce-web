"use client";

import { useState, useCallback, useMemo } from "react";
import type { Address } from "@/shared/api/types";

interface UseAddressStepParams {
  addresses?: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function useAddressStep({
  addresses,
  selectedId,
  onSelect,
}: UseAddressStepParams) {
  const [showDialog, setShowDialog] = useState(false);
  const hasAddresses = Boolean(addresses?.length);

  const addressCountText = useMemo(() => {
    if (!addresses?.length) return "";
    const count = addresses.length;
    return `${count} saved ${count === 1 ? "address" : "addresses"}`;
  }, [addresses]);

  const emptyHintMessage = useMemo(() => {
    return !hasAddresses
      ? "Add a delivery address to continue."
      : "Select a delivery address to continue.";
  }, [hasAddresses]);

  const openDialog = useCallback(() => {
    setShowDialog(true);
  }, []);

  const closeDialog = useCallback(() => {
    setShowDialog(false);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      onSelect(id);
    },
    [onSelect],
  );

  return {
    showDialog,
    setShowDialog,
    openDialog,
    closeDialog,
    hasAddresses,
    addressCountText,
    emptyHintMessage,
    handleSelect,
    canContinue: Boolean(selectedId),
  };
}
