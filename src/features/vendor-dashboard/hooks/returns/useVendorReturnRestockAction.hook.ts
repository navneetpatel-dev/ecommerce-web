"use client";

import { useState, useCallback } from "react";
import { useVendorReturnRestock } from "./useVendorReturnRestock.hook";
import { useVendorReturnDispute } from "./useVendorReturnDispute.hook";
import type { VendorReturnRowViewModel } from "./useVendorReturnsTablePresentation.hook";

interface UseVendorReturnRestockActionOptions {
  row: VendorReturnRowViewModel;
}

export function useVendorReturnRestockAction({
  row,
}: UseVendorReturnRestockActionOptions) {
  const [disputeOpen, setDisputeOpen] = useState(false);
  const { handleRestock } = useVendorReturnRestock(row.id);
  const { handleDispute, isSubmitting: disputeSubmitting } =
    useVendorReturnDispute(row.id);

  const handleOpenDispute = useCallback(() => {
    setDisputeOpen(true);
  }, []);

  const handleCloseDispute = useCallback(() => {
    setDisputeOpen(false);
  }, []);

  const handleDisputeOpenChange = useCallback((open: boolean) => {
    setDisputeOpen(open);
  }, []);

  const handleDisputeSubmit = useCallback(
    async (data: {
      reason: string;
      description: string;
      evidenceUrls: string[];
    }) => {
      await handleDispute(data);
      setDisputeOpen(false);
    },
    [handleDispute],
  );

  return {
    disputeOpen,
    disputeSubmitting,
    handleOpenDispute,
    handleCloseDispute,
    handleDisputeOpenChange,
    handleRestock,
    handleDisputeSubmit,
  };
}
