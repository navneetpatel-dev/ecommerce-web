"use client";

import { useState, type ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

interface VendorReturnDisputeDialogProps {
  open: boolean;
  productName: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    reason: string;
    description: string;
    evidenceUrls: string[];
  }) => void;
}

export function VendorReturnDisputeDialog({
  open,
  productName,
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorReturnDisputeDialogProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const close = () => {
    if (submitting) return;
    onOpenChange(false);
  };

  const canSend = Boolean(reason.trim()) && Boolean(description.trim());

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      close();
      setReason("");
      setDescription("");
      setEvidenceUrl("");
      return;
    }
    onOpenChange(true);
  };

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="warning"
      title="Dispute Returned Item"
      description={`Report an issue with the returned package for "${productName}" (e.g. damaged by customer, wrong item returned, or empty parcel).`}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: close,
      }}
      primaryAction={{
        label: "Submit Dispute",
        loading: submitting,
        disabled: !canSend,
        onClick: () =>
          onSubmit({
            reason: reason.trim(),
            description: description.trim(),
            evidenceUrls: evidenceUrl.trim() ? [evidenceUrl.trim()] : [],
          }),
      }}
    >
      <div className="space-y-4">
        <FormFieldFrame
          label="Dispute Reason"
          htmlFor="vendor-return-dispute-reason"
          required
        >
          <Input
            id="vendor-return-dispute-reason"
            placeholder="e.g. Damaged goods returned, Missing tags, Wrong product"
            value={reason}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setReason(e.target.value)
            }
            disabled={submitting}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label="Detailed Explanation"
          htmlFor="vendor-return-dispute-description"
          required
          hint="Describe the discrepancy between what was sent and what was received."
        >
          <Textarea
            id="vendor-return-dispute-description"
            placeholder="Provide full details for admin review..."
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            disabled={submitting}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label="Photo Evidence URL"
          htmlFor="vendor-return-dispute-url"
          hint="Paste photo or unboxing video URL showing the damaged / incorrect parcel."
        >
          <Input
            id="vendor-return-dispute-url"
            type="url"
            placeholder="https://..."
            value={evidenceUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEvidenceUrl(e.target.value)
            }
            disabled={submitting}
          />
        </FormFieldFrame>
      </div>
    </StatusDialog>
  );
}
