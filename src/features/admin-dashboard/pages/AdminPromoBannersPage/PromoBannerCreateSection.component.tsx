"use client";

import { FileUpload } from "@/shared/components/FileUpload.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
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
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_LINK_TYPE_VALUES,
  PROMO_BANNER_STATUS_VALUES,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import { promoBannerSectionStyles } from "./adminPromoBanners.styles";

interface PromoBannerCreateSectionProps {
  draftId: string;
  title: string;
  onTitleChange: (value: string) => void;
  imageUrl: string | null;
  onImageUploaded: (url: string | null) => void;
  linkType: PromoBannerLinkType;
  onLinkTypeChange: (value: PromoBannerLinkType) => void;
  status: PromoBannerStatus;
  onStatusChange: (value: PromoBannerStatus) => void;
  linkUrl: string;
  onLinkUrlChange: (value: string) => void;
  linkTargetId: string;
  onLinkTargetIdChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  saving: boolean;
  message: string | null;
  canSubmit: boolean;
  disableHint: string;
  onCreate: () => void;
}

export function PromoBannerCreateSection({
  draftId,
  title,
  onTitleChange,
  imageUrl,
  onImageUploaded,
  linkType,
  onLinkTypeChange,
  status,
  onStatusChange,
  linkUrl,
  onLinkUrlChange,
  linkTargetId,
  onLinkTargetIdChange,
  priority,
  onPriorityChange,
  saving,
  message,
  canSubmit,
  disableHint,
  onCreate,
}: PromoBannerCreateSectionProps) {
  return (
    <FormSection
      title={LABELS.promoBannerFormSection}
      hint={LABELS.promoBannerFormSectionHint}
    >
      <FormFieldFrame
        label={LABELS.promoBannerTitle}
        className={promoBannerSectionStyles.colSpan2}
      >
        <Input value={title} onChange={(e) => onTitleChange(e.target.value)} />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.promoBannerImage}
        className={promoBannerSectionStyles.colSpan2}
      >
        <FileUpload
          entityType={UPLOAD_ENTITY.BANNERS}
          entityId={draftId}
          purpose={UPLOAD_PURPOSE.IMAGE}
          accept="image/png,image/jpeg,image/webp"
          valueUrl={imageUrl}
          onUploaded={onImageUploaded}
          disabled={saving}
          label={LABELS.promoBannerImage}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.promoBannerLinkType}>
        <Select
          value={linkType}
          onValueChange={(value) =>
            onLinkTypeChange(value as PromoBannerLinkType)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROMO_BANNER_LINK_TYPE_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.promoBannerStatus}>
        <Select
          value={status}
          onValueChange={(value) => onStatusChange(value as PromoBannerStatus)}
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
      {linkType === PROMO_BANNER_LINK_TYPE.URL ? (
        <FormFieldFrame
          label={LABELS.promoBannerLinkUrl}
          className={promoBannerSectionStyles.colSpan2}
        >
          <Input
            value={linkUrl}
            onChange={(e) => onLinkUrlChange(e.target.value)}
          />
        </FormFieldFrame>
      ) : (
        <FormFieldFrame
          label={LABELS.promoBannerLinkTargetId}
          className={promoBannerSectionStyles.colSpan2}
        >
          <Input
            value={linkTargetId}
            onChange={(e) => onLinkTargetIdChange(e.target.value)}
          />
        </FormFieldFrame>
      )}
      <FormFieldFrame label={LABELS.promoBannerPriority}>
        <NumberInput
          value={priority === "" ? undefined : Number(priority)}
          step={1}
          onChange={(value) =>
            onPriorityChange(value == null ? "" : String(value))
          }
        />
      </FormFieldFrame>
      <FormActions
        className={promoBannerSectionStyles.colSpan2}
        leading={message}
      >
        <DisabledActionHint disabled={!canSubmit} message={disableHint}>
          <Button
            type="button"
            disabled={saving || !canSubmit}
            onClick={onCreate}
          >
            {LABELS.createPromoBanner}
          </Button>
        </DisabledActionHint>
      </FormActions>
    </FormSection>
  );
}
