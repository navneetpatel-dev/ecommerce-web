"use client";

import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";

interface ProductImagesSectionProps {
  imageUrls: string[];
  draftUploadId: string;
  disabled: boolean;
  onImageUrlsChange: (urls: string[]) => void;
}

export function ProductImagesSection({
  imageUrls,
  draftUploadId,
  disabled,
  onImageUrlsChange,
}: ProductImagesSectionProps) {
  return (
    <FormSection
      title={LABELS.productFormSectionImages}
      hint={LABELS.productFormSectionImagesHint}
      columns={1}
    >
      <FileUpload
        mode="multiple"
        entityType={UPLOAD_ENTITY.PRODUCTS}
        entityId={draftUploadId}
        purpose={UPLOAD_PURPOSE.IMAGES}
        accept="image/png,image/jpeg,image/webp"
        valueUrls={imageUrls}
        onUploaded={onImageUrlsChange}
        label={LABELS.productImagesLabel}
        disabled={disabled}
      />
    </FormSection>
  );
}
