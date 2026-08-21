"use client";

import { StatusDialog } from "@/shared/components/StatusDialog";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import type { KycChecklistItem } from "@/features/vendors";

interface KycConfirmDialogsProps {
  mode: "verify" | "reject" | null;
  activeItem: KycChecklistItem | null;
  vendorName: string;
  submitting: boolean;
  reason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onVerify: () => void;
  onReject: () => void;
}

export function KycConfirmDialogs({
  mode,
  activeItem,
  vendorName,
  submitting,
  reason,
  onReasonChange,
  onClose,
  onVerify,
  onReject,
}: KycConfirmDialogsProps) {
  return (
    <>
      <StatusDialog
        open={mode === "verify" && Boolean(activeItem)}
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
        variant="success"
        title={LABELS.confirmVerifyDocumentTitle}
        description={
          activeItem
            ? formatLabel(LABELS.confirmVerifyDocumentBody, {
                type: vendorDocumentTypeLabel(activeItem.documentType),
                name: vendorName,
              })
            : undefined
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting,
          onClick: onClose,
        }}
        primaryAction={{
          label: LABELS.verifyDocument,
          loading: submitting,
          onClick: onVerify,
        }}
      />

      <StatusDialog
        open={mode === "reject" && Boolean(activeItem)}
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
        variant="danger"
        title={LABELS.confirmRejectDocumentTitle}
        description={
          activeItem
            ? formatLabel(LABELS.confirmRejectDocumentBody, {
                type: vendorDocumentTypeLabel(activeItem.documentType),
                name: vendorName,
              })
            : undefined
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting,
          onClick: onClose,
        }}
        primaryAction={{
          label: LABELS.rejectDocument,
          loading: submitting,
          disabled: !reason.trim(),
          onClick: onReject,
        }}
      >
        <FormFieldFrame
          label={LABELS.documentRejectionReason}
          htmlFor="kyc-reject-reason"
        >
          <Textarea
            id="kyc-reject-reason"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="min-h-24 resize-y"
          />
        </FormFieldFrame>
      </StatusDialog>
    </>
  );
}
