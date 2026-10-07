"use client";

import { useState, type ChangeEvent } from "react";
import { useCreateReturn } from "@/features/returns";
import { LABELS } from "@/shared/constants/labels";
import { useDiscardChangesGuard } from "@/shared/hooks/dialogs/useDiscardChangesGuard.hook";
import { RETURN_REASON, type ReturnReason } from "@/shared/constants/statuses";
import type { OrderItem } from "@/shared/api/types";

const REASON_CODES = [
  { value: RETURN_REASON.DAMAGED, label: LABELS.returnReasonDamaged },
  { value: RETURN_REASON.WRONG_ITEM, label: LABELS.returnReasonWrongItem },
  {
    value: RETURN_REASON.NOT_AS_DESCRIBED,
    label: LABELS.returnReasonNotAsDescribed,
  },
  {
    value: RETURN_REASON.NO_LONGER_NEEDED,
    label: LABELS.returnReasonNoLongerNeeded,
  },
  { value: RETURN_REASON.OTHER, label: LABELS.returnReasonOther },
] as const;

export type ReturnReasonCode = ReturnReason;

export { REASON_CODES };

export function useSubOrderReturn() {
  const [target, setTarget] = useState<OrderItem | null>(null);
  const [reasonCode, setReasonCode] = useState<ReturnReasonCode>(
    RETURN_REASON.DAMAGED,
  );
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"REFUND" | "EXCHANGE">("REFUND");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [draftUploadId, setDraftUploadId] = useState(() => crypto.randomUUID());
  const createReturn = useCreateReturn();

  const openDialog = (item: OrderItem) => {
    setTarget(item);
    setReason("");
    setReasonCode(RETURN_REASON.DAMAGED);
    setType("REFUND");
    setPhotoUrls([]);
    setDraftUploadId(crypto.randomUUID());
    createReturn.reset();
  };

  const closeDialog = () => setTarget(null);

  // Any typed reason, attached photo, or non-default resolution is unsaved
  // work — dismissing the dialog then asks for confirmation first.
  const isDirty =
    reason.trim().length > 0 || photoUrls.length > 0 || type !== "REFUND";
  const discard = useDiscardChangesGuard(isDirty);

  const handleDialogOpenChange = (open: boolean) => {
    if (open) return;
    discard.requestClose(closeDialog);
  };

  const handleCancelReturn = () => {
    discard.requestClose(closeDialog);
  };

  const handleReturnTypeSelect = (value: string) => {
    setType(value as "REFUND" | "EXCHANGE");
  };

  const handleReasonCodeSelect = (value: string) => {
    setReasonCode(value as ReturnReasonCode);
  };

  const handleReasonInput = (event: ChangeEvent<HTMLInputElement>) => {
    setReason(event.target.value);
  };

  const submitReturn = async () => {
    if (!target) return;
    await createReturn.mutateAsync({
      orderItemId: target.id,
      reasonCode,
      reason: reason.trim(),
      type,
      photoUrls,
    });
    setTarget(null);
  };

  return {
    target,
    reasonCode,
    reason,
    type,
    photoUrls,
    setPhotoUrls,
    draftUploadId,
    openDialog,
    submitReturn,
    isPending: createReturn.isPending,
    isSuccess: createReturn.isSuccess,
    error: createReturn.error as Error | null,
    reset: createReturn.reset,
    handleDialogOpenChange,
    handleCancelReturn,
    handleReturnTypeSelect,
    handleReasonCodeSelect,
    handleReasonInput,
    discardOpen: discard.confirmOpen,
    handleDiscardOpenChange: discard.handleConfirmOpenChange,
    confirmDiscard: discard.confirmDiscard,
    cancelDiscard: discard.cancelDiscard,
  };
}
