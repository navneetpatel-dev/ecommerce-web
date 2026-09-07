"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { FilePicker } from "@/shared/components/FilePicker.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { payoutsApi } from "../api/finance.api";
import type { PayoutPaymentMethod } from "@/shared/api/types";

const PAYMENT_METHODS: PayoutPaymentMethod[] = [
  "NEFT",
  "IMPS",
  "UPI",
  "RTGS",
  "CHEQUE",
  "CASH",
  "OTHER",
];

export function AdminMarkPayoutPaidAction({
  payoutId,
  onDone,
}: {
  payoutId: string;
  onDone: () => void;
}) {
  const upload = usePresignUpload();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PayoutPaymentMethod>("NEFT");
  const [reference, setReference] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [remarks, setRemarks] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (pending) return;
    setOpen(false);
    setError(null);
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
      await payoutsApi.markPaid(payoutId, {
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
        getApiErrorMessage(submitError, "Could not mark this payout as paid."),
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <CheckCircle2 className="size-4" aria-hidden="true" />
        Mark paid
      </Button>
      <StatusDialog
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : close())}
        variant="success"
        title="Mark payout as paid"
        description="Record the completed transfer. This action cannot be reversed here."
        secondaryAction={{ label: "Cancel", onClick: close, disabled: pending }}
        primaryAction={{
          label: "Mark paid",
          onClick: () => void submit(),
          loading: pending,
          disabled: !reference.trim(),
          disabledHint: "Enter a payment reference number.",
        }}
      >
        <FormFieldFrame
          label="Payment method"
          htmlFor={`payout-method-${payoutId}`}
          required
        >
          <Select
            value={method}
            onValueChange={(value) => setMethod(value as PayoutPaymentMethod)}
          >
            <SelectTrigger id={`payout-method-${payoutId}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame
          label="Payment reference number"
          htmlFor={`payout-reference-${payoutId}`}
          required
        >
          <Input
            id={`payout-reference-${payoutId}`}
            value={reference}
            maxLength={120}
            placeholder="UTR, transaction ID, or cheque number"
            onChange={(event) => setReference(event.target.value)}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label="Paid at (optional)"
          htmlFor={`payout-date-${payoutId}`}
        >
          <Input
            id={`payout-date-${payoutId}`}
            type="datetime-local"
            value={paidAt}
            onChange={(event) => setPaidAt(event.target.value)}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label="Proof of payment (optional)"
          htmlFor={`payout-proof-${payoutId}`}
        >
          <FilePicker
            id={`payout-proof-${payoutId}`}
            accept="image/jpeg,image/png,image/webp,application/pdf"
            maxBytes={5 * 1024 * 1024}
            value={proof}
            onChange={setProof}
            disabled={pending}
            hint="PNG, JPEG, WebP, or PDF • Max 5 MB"
          />
        </FormFieldFrame>
        <FormFieldFrame
          label="Remarks (optional)"
          htmlFor={`payout-remarks-${payoutId}`}
        >
          <Textarea
            id={`payout-remarks-${payoutId}`}
            value={remarks}
            maxLength={2000}
            onChange={(event) => setRemarks(event.target.value)}
          />
        </FormFieldFrame>
        {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      </StatusDialog>
    </>
  );
}
