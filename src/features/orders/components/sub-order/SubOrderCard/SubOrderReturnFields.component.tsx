import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
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
import {
  REASON_CODES,
  type ReturnQuantityField,
  type ReturnReasonCode,
} from "../../../hooks/sub-order/useSubOrderReturn.hook";
import { SubOrderReturnQuantityField } from "./SubOrderReturnQuantityField.component";

interface SubOrderReturnFieldsProps {
  quantityField: ReturnQuantityField | null;
  reasonCode: ReturnReasonCode;
  reason: string;
  returnType: "REFUND" | "EXCHANGE";
  photoUrls: string[];
  draftUploadId: string;
  onReasonCodeSelect: (value: string) => void;
  onReasonInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onReturnTypeSelect: (value: string) => void;
  onPhotoUrlsChange: (urls: string[]) => void;
}

/** What the shopper fills in to return an item. */
export function SubOrderReturnFields({
  quantityField,
  reasonCode,
  reason,
  returnType,
  photoUrls,
  draftUploadId,
  onReasonCodeSelect,
  onReasonInput,
  onReturnTypeSelect,
  onPhotoUrlsChange,
}: SubOrderReturnFieldsProps) {
  return (
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
            <SelectItem value="REFUND">{LABELS.returnTypeRefund}</SelectItem>
            <SelectItem value="EXCHANGE">
              {LABELS.returnTypeExchange}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <SubOrderReturnQuantityField field={quantityField} />
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
      <FormFieldFrame label={LABELS.returnDetailsLabel} htmlFor="return-reason">
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
  );
}
