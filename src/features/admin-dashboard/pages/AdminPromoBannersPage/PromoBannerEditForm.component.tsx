"use client";

import { FileUpload } from "@/shared/components/FileUpload.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { NumberInput } from "@/shared/components/NumberInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import {
  PROMO_BANNER_STATUS_VALUES,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import { promoBannerSectionStyles } from "./adminPromoBanners.styles";

interface PromoBannerEditFormProps {
  bannerId: string;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  editImageUrl: string | null;
  onEditImageUploaded: (url: string | null) => void;
  editStatus: PromoBannerStatus;
  onEditStatusChange: (value: PromoBannerStatus) => void;
  editPriority: string;
  onEditPriorityChange: (value: string) => void;
  saving: boolean;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

export function PromoBannerEditForm({
  bannerId,
  editTitle,
  onEditTitleChange,
  editImageUrl,
  onEditImageUploaded,
  editStatus,
  onEditStatusChange,
  editPriority,
  onEditPriorityChange,
  saving,
  onCancelEdit,
  onSaveEdit,
}: PromoBannerEditFormProps) {
  return (
    <FormSection
      title={LABELS.promoBannerEditSection}
      hint={LABELS.promoBannerEditSectionHint}
      className={promoBannerSectionStyles.editSection}
    >
      <FormFieldFrame
        label={LABELS.promoBannerTitle}
        className={promoBannerSectionStyles.colSpan2}
      >
        <Input
          value={editTitle}
          onChange={(e) => onEditTitleChange(e.target.value)}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.promoBannerImage}
        className={promoBannerSectionStyles.colSpan2}
      >
        <FileUpload
          entityType={UPLOAD_ENTITY.BANNERS}
          entityId={bannerId}
          purpose={UPLOAD_PURPOSE.IMAGE}
          accept="image/png,image/jpeg,image/webp"
          valueUrl={editImageUrl}
          onUploaded={onEditImageUploaded}
          disabled={saving}
          label={LABELS.replaceImage}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.promoBannerStatus}>
        <Select
          value={editStatus}
          onValueChange={(value) =>
            onEditStatusChange(value as PromoBannerStatus)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROMO_BANNER_STATUS_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.promoBannerPriority}>
        <NumberInput
          value={editPriority === "" ? undefined : Number(editPriority)}
          step={1}
          onChange={(value) =>
            onEditPriorityChange(value == null ? "" : String(value))
          }
        />
      </FormFieldFrame>
      <FormActions className={promoBannerSectionStyles.colSpan2}>
        <Button
          size="sm"
          variant="outline"
          disabled={saving}
          onClick={onCancelEdit}
        >
          {LABELS.cancel}
        </Button>
        <Button
          size="sm"
          disabled={saving || !editImageUrl}
          onClick={onSaveEdit}
        >
          {LABELS.savePromoBanner}
        </Button>
      </FormActions>
    </FormSection>
  );
}
