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
import { FormError } from "@/shared/components/FormError";
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
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  REASON_CODES,
  type ReturnReasonCode,
} from "../../hooks/useSubOrderReturn";

interface SubOrderReturnDialogProps {
  returnTarget: OrderItem | null;
  reasonCode: ReturnReasonCode;
  reason: string;
  photoUrls: string[];
  draftUploadId: string;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  onCloseReturn: () => void;
  onReasonCodeChange: (code: ReturnReasonCode) => void;
  onReasonChange: (value: string) => void;
  onPhotoUrlsChange: (urls: string[]) => void;
  onSubmitReturn: () => void;
}

export function SubOrderReturnDialog({
  returnTarget,
  reasonCode,
  reason,
  photoUrls,
  draftUploadId,
  isPending,
  isSuccess,
  error,
  onCloseReturn,
  onReasonCodeChange,
  onReasonChange,
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
        <div className="space-y-4">
          <FormSection
            title={LABELS.returnRequestFormSection}
            hint={LABELS.returnRequestFormSectionHint}
            columns={1}
          >
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
            <p className="text-[0.875rem] text-success">
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
