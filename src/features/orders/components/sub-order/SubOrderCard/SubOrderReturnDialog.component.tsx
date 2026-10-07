import type { ChangeEvent } from "react";
import type { OrderItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { DiscardChangesDialog } from "@/shared/components/dialogs/DiscardChangesDialog.component";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormError } from "@/shared/components/forms/FormError.component";
import { FileUpload } from "@/shared/components/FileUpload";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  REASON_CODES,
  type ReturnReasonCode,
} from "../../../hooks/sub-order/useSubOrderReturn.hook";
import { SUB_ORDER_CARD_STYLES } from "../../../styles/sub-order/subOrderCard.styles";

interface SubOrderReturnDialogProps {
  returnTarget: OrderItem | null;
  reasonCode: ReturnReasonCode;
  reason: string;
  returnType: "REFUND" | "EXCHANGE";
  photoUrls: string[];
  draftUploadId: string;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  /** Dialog dismissal (Escape/backdrop) — guard-aware. */
  onDialogOpenChange: (open: boolean) => void;
  /** Cancel button — guard-aware. */
  onRequestClose: () => void;
  onReasonCodeSelect: (value: string) => void;
  onReasonInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onReturnTypeSelect: (value: string) => void;
  onPhotoUrlsChange: (urls: string[]) => void;
  onSubmitReturn: () => void;
  discardOpen: boolean;
  onDiscardOpenChange: (open: boolean) => void;
  onConfirmDiscard: () => void;
  onKeepEditing: () => void;
}

export function SubOrderReturnDialog({
  returnTarget,
  reasonCode,
  reason,
  returnType,
  photoUrls,
  draftUploadId,
  isPending,
  isSuccess,
  error,
  onDialogOpenChange,
  onRequestClose,
  onReasonCodeSelect,
  onReasonInput,
  onReturnTypeSelect,
  onPhotoUrlsChange,
  onSubmitReturn,
  discardOpen,
  onDiscardOpenChange,
  onConfirmDiscard,
  onKeepEditing,
}: SubOrderReturnDialogProps) {
  return (
    <>
      <Dialog open={Boolean(returnTarget)} onOpenChange={onDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{LABELS.requestReturnTitle}</DialogTitle>
            <DialogDescription>
              {returnTarget?.productName
                ? formatLabel(LABELS.requestReturnDescriptionItem, {
                    product: returnTarget.productName,
                  })
                : LABELS.requestReturnDescription}
            </DialogDescription>
          </DialogHeader>
          <div className={SUB_ORDER_CARD_STYLES.returnDialogBody}>
            <FormSection
              title={LABELS.returnRequestFormSection}
              hint={LABELS.returnRequestFormSectionHint}
              columns={1}
            >
              <FormFieldFrame
                label={LABELS.returnResolutionLabel}
                htmlFor="return-type"
              >
                <Select value={returnType} onValueChange={onReturnTypeSelect}>
                  <SelectTrigger id="return-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REFUND">
                      {LABELS.returnTypeRefund}
                    </SelectItem>
                    <SelectItem value="EXCHANGE">
                      {LABELS.returnTypeExchange}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormFieldFrame>
              <FormFieldFrame
                label={LABELS.returnReasonLabel}
                htmlFor="return-reason-code"
              >
                <Select value={reasonCode} onValueChange={onReasonCodeSelect}>
                  <SelectTrigger id="return-reason-code">
                    <SelectValue placeholder={LABELS.returnReasonLabel} />
                  </SelectTrigger>
                  <SelectContent>
                    {REASON_CODES.map((code) => (
                      <SelectItem key={code.value} value={code.value}>
                        {code.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
              <FormFieldFrame
                label={LABELS.returnDetailsLabel}
                htmlFor="return-reason"
              >
                <Input
                  id="return-reason"
                  value={reason}
                  onChange={onReasonInput}
                  placeholder={LABELS.returnDetailsPlaceholder}
                />
              </FormFieldFrame>
              <FileUpload
                mode="multiple"
                entityType={UPLOAD_ENTITY.RETURNS}
                entityId={draftUploadId}
                purpose={UPLOAD_PURPOSE.PHOTOS}
                accept="image/png,image/jpeg,image/webp"
                valueUrls={photoUrls}
                onUploaded={onPhotoUrlsChange}
                label={LABELS.returnPhotosLabel}
              />
            </FormSection>
            <FormError error={error} fallback={LABELS.couldNotSubmitReturn} />
            {isSuccess ? (
              <p className={SUB_ORDER_CARD_STYLES.returnSuccessText}>
                {LABELS.returnRequestedSuccess}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onRequestClose}>
              {LABELS.cancelReturn}
            </Button>
            <Button
              type="button"
              loading={isPending}
              disabled={!reason.trim() || !returnTarget}
              onClick={onSubmitReturn}
            >
              {LABELS.submitReturn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DiscardChangesDialog
        open={discardOpen}
        onOpenChange={onDiscardOpenChange}
        onDiscard={onConfirmDiscard}
        onKeepEditing={onKeepEditing}
      />
    </>
  );
}
