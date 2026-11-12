"use client";

import { useState, useCallback, useMemo, type ChangeEvent } from "react";
import type { Address } from "@/shared/api/types";
import {
  ADDRESS_SEARCH_THRESHOLD,
  filterAddresses,
} from "../../utils/address/addressSearch";

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
  const [searchTerm, setSearchTerm] = useState("");
  const hasAddresses = Boolean(addresses?.length);
  const showSearch = (addresses?.length ?? 0) > ADDRESS_SEARCH_THRESHOLD;
  const visibleAddresses = useMemo(
    () => filterAddresses(addresses ?? [], showSearch ? searchTerm : ""),
    [addresses, searchTerm, showSearch],
  );
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

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
    showSearch,
    searchTerm,
    visibleAddresses,
    handleSearchChange,
    canContinue: Boolean(selectedId),
  };
}
