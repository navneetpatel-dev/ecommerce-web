"use client";

import { useState, type ChangeEvent } from "react";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import {
  deliveryAdminApi,
  type AgentPayoutPaymentMethod,
} from "@/features/delivery-dashboard";

export const AGENT_PAYMENT_METHODS: readonly AgentPayoutPaymentMethod[] = [
  "NEFT",
  "IMPS",
  "UPI",
  "RTGS",
  "CHEQUE",
  "CASH",
  "OTHER",
] as const;

interface UseAgentMarkPayoutPaidActionParams {
  payoutId: string;
  onDone: () => void;
}

export function useAgentMarkPayoutPaidAction({
  payoutId,
  onDone,
}: UseAgentMarkPayoutPaidActionParams) {
  const upload = usePresignUpload();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<AgentPayoutPaymentMethod>("UPI");
  const [reference, setReference] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setOpen(true);
  };

  const close = () => {
    if (pending) return;
    setOpen(false);
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setOpen(true);
    } else {
      close();
    }
  };

  const handleMethodChange = (value: string) => {
    setMethod(value as AgentPayoutPaymentMethod);
  };

  const handleReferenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReference(event.target.value);
  };

  const handlePaidAtChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPaidAt(event.target.value);
  };

  const handleRemarksChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setRemarks(event.target.value);
  };

  const submit = async () => {
    if (!reference.trim()) return;
    setPending(true);
    setError(null);
    try {
      let proofOfPaymentUrl: string | undefined;
      if (proof) {
        const result = await upload.mutateAsync({
          entityType: UPLOAD_ENTITY.PAYOUTS,
          entityId: payoutId,
          purpose: UPLOAD_PURPOSE.ATTACHMENTS,
          filename: proof.name,
          contentType: proof.type || "application/octet-stream",
          contentLength: proof.size,
          file: proof,
        });
        proofOfPaymentUrl = result.url;
      }
      await deliveryAdminApi.markPayoutPaid(payoutId, {
        paymentMethod: method,
        paymentReferenceNumber: reference.trim(),
        paidAt: paidAt ? new Date(paidAt).toISOString() : undefined,
        proofOfPaymentUrl,
        remarks: remarks.trim() || undefined,
      });
      setOpen(false);
      onDone();
    } catch (submitError) {
      setError(
        getApiErrorMessage(
          submitError,
          "Could not mark this agent payout as paid.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  return {
    open,
    method,
    reference,
    paidAt,
    remarks,
    proof,
    setProof,
    pending,
    error,
    openDialog,
    close,
    handleOpenChange,
    handleMethodChange,
    handleReferenceChange,
    handlePaidAtChange,
    handleRemarksChange,
    submit,
  };
}
