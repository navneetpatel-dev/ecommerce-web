import type { OrderItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FormError } from "@/shared/components/FormError.component";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  REASON_CODES,
  type ReturnReasonCode,
} from "../../../hooks/sub-order/useSubOrderReturn.hook";
import { SUB_ORDER_CARD_STYLES } from "./subOrderCard.styles";

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
  onCloseReturn: () => void;
  onReasonCodeChange: (code: ReturnReasonCode) => void;
  onReasonChange: (value: string) => void;
  onReturnTypeChange: (value: "REFUND" | "EXCHANGE") => void;
  onPhotoUrlsChange: (urls: string[]) => void;
  onSubmitReturn: () => void;
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
  onCloseReturn,
  onReasonCodeChange,
  onReasonChange,
  onReturnTypeChange,
  onPhotoUrlsChange,
  onSubmitReturn,
}: SubOrderReturnDialogProps) {
  return (
    <Dialog
      open={Boolean(returnTarget)}
      onOpenChange={(open) => !open && onCloseReturn()}
    >
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
            <FormFieldFrame label="Resolution" htmlFor="return-type">
              <Select
                value={returnType}
                onValueChange={(value) =>
                  onReturnTypeChange(value as "REFUND" | "EXCHANGE")
                }
              >
                <SelectTrigger id="return-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REFUND">Refund</SelectItem>
                  <SelectItem value="EXCHANGE">Exchange</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldFrame>
            <FormFieldFrame
              label={LABELS.returnReasonLabel}
              htmlFor="return-reason-code"
            >
              <Select
                value={reasonCode}
                onValueChange={(value) =>
                  onReasonCodeChange(value as ReturnReasonCode)
                }
              >
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
                onChange={(e) => onReasonChange(e.target.value)}
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
          <Button type="button" variant="outline" onClick={onCloseReturn}>
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
  );
}
