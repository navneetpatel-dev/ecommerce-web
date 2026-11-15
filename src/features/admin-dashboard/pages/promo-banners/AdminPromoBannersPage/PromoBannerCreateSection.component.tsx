"use client";

import type { ChangeEvent } from "react";
import { FileUpload } from "@/shared/components/FileUpload";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
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
  PROMO_BANNER_LINK_TYPE_VALUES,
  PROMO_BANNER_STATUS_VALUES,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from "@/shared/constants/statuses";
import { promoBannerSectionStyles } from "./adminPromoBanners.styles";
import { PromoBannerTargetField } from "./PromoBannerTargetField.component";

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
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onTitleChange(event.target.value);
  const handleLinkTypeChange = (value: string) => {
    onLinkTypeChange(value as PromoBannerLinkType);
    onLinkTargetIdChange("");
  };
  const handleStatusChange = (value: string) =>
    onStatusChange(value as PromoBannerStatus);
  const handlePriorityChange = (value: number | undefined) =>
    onPriorityChange(value == null ? "" : String(value));

  return (
    <FormSection
      title={LABELS.promoBannerFormSection}
      hint={LABELS.promoBannerFormSectionHint}
    >
      <FormFieldFrame
        label={LABELS.promoBannerTitle}
        htmlFor="banner-title"
        className={promoBannerSectionStyles.colSpan2}
      >
        <Input id="banner-title" value={title} onChange={handleTitleChange} />
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
      <FormFieldFrame
        label={LABELS.promoBannerLinkType}
        htmlFor="banner-link-type"
      >
        <Select value={linkType} onValueChange={handleLinkTypeChange}>
          <SelectTrigger id="banner-link-type">
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
      <FormFieldFrame label={LABELS.promoBannerStatus} htmlFor="banner-status">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger id="banner-status">
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
      <PromoBannerTargetField
        linkType={linkType}
        linkUrl={linkUrl}
        onLinkUrlChange={onLinkUrlChange}
        linkTargetId={linkTargetId}
        onLinkTargetIdChange={onLinkTargetIdChange}
      />
      <FormFieldFrame
        label={LABELS.promoBannerPriority}
        htmlFor="banner-priority"
      >
        <NumberInput
          id="banner-priority"
          value={priority === "" ? undefined : Number(priority)}
          step={1}
          onChange={handlePriorityChange}
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
