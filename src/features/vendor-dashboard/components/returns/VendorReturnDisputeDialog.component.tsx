"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { useVendorReturnDisputeDialog } from "../../hooks/returns/useVendorReturnDisputeDialog.hook";
import { vendorReturnsTableStyles as styles } from "../../styles/returns/vendorReturnsTable.styles";

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
  const {
    reason,
    description,
    evidenceUrl,
    canSend,
    handleClose,
    handleOpenChange,
    handleReasonChange,
    handleDescriptionChange,
    handleEvidenceUrlChange,
    handleSubmit,
  } = useVendorReturnDisputeDialog({ submitting, onOpenChange, onSubmit });

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
        onClick: handleClose,
      }}
      primaryAction={{
        label: "Submit Dispute",
        loading: submitting,
        disabled: !canSend,
        onClick: handleSubmit,
      }}
    >
      <div className={styles.dialogFormStack}>
        <FormFieldFrame
          label="Dispute Reason"
          htmlFor="vendor-return-dispute-reason"
          required
        >
          <Input
            id="vendor-return-dispute-reason"
            placeholder="e.g. Damaged goods returned, Missing tags, Wrong product"
            value={reason}
            onChange={handleReasonChange}
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
            onChange={handleDescriptionChange}
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
            onChange={handleEvidenceUrlChange}
            disabled={submitting}
          />
        </FormFieldFrame>

        {evidenceUrl.trim() ? (
          <div className="flex items-center gap-3 rounded-md border border-line bg-paper/40 p-2">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-line bg-paper">
              <MediaImage
                src={evidenceUrl.trim()}
                alt="Dispute evidence preview"
                sizes="56px"
                imageClassName="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-xs font-medium text-ink">
                Evidence preview
              </p>
              <p className="text-[11px] text-ink-muted truncate">
                {evidenceUrl.trim()}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </StatusDialog>
  );
}
