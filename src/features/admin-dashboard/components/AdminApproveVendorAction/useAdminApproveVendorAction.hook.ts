"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";

interface UseAdminApproveVendorActionParams {
  onApprove: (commissionRate?: number) => void | Promise<unknown>;
}

export function useAdminApproveVendorAction({
  onApprove,
}: UseAdminApproveVendorActionParams) {
  const [open, setOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;
    setOpen(false);
    setCommissionRate(undefined);
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) handleClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await onApprove(commissionRate);
      setOpen(false);
      setCommissionRate(undefined);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setLoading(false);
    }
  };

  return {
    open,
    commissionRate,
    setCommissionRate,
    loading,
    error,
    handleOpen,
    handleClose,
    handleOpenChange,
    handleSubmit,
  };
}
