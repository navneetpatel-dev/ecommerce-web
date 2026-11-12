"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { RETURN_STATUS } from "@/shared/constants/statuses";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { navigate } from "@/shared/utils/navigation/navigate";
import type { ReturnRequest } from "@/shared/api/types";
import { useCancelReturn } from "../../api/returns/returns.queries";

/** Withdraw a return that is still only requested (B-50), after a confirm. */
export function useCancelReturnAction(row: ReturnRequest | undefined) {
  const router = useRouter();
  const cancel = useCancelReturn();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setError(null);
    setConfirmOpen(true);
  };
  const handleClose = () => setConfirmOpen(false);
  const handleConfirm = () => {
    if (!row) return;
    cancel.mutate(row.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        notifySuccess(LABELS.returnCancelled);
        navigate(router, PATHS.myReturns);
      },
      onError: (err) => {
        setConfirmOpen(false);
        setError(getApiErrorMessage(err, LABELS.couldNotCancelReturn));
      },
    });
  };

  return {
    canCancel: row?.status === RETURN_STATUS.REQUESTED,
    confirmOpen,
    isPending: cancel.isPending,
    error,
    handleOpen,
    handleClose,
    handleConfirm,
  };
}
