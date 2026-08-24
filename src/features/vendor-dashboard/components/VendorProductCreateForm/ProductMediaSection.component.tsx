"use client";

import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "@/features/products";

interface ProductMediaSectionProps {
  values: ProductListingFormValues;
  draftUploadId: string;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
}

export function ProductMediaSection({
  values,
  draftUploadId,
  disabled,
  getError,
  patchValues,
}: ProductMediaSectionProps) {
  return (
    <FormSection
      title={LABELS.productFormSectionMedia}
      hint={LABELS.productFormSectionMediaHint}
      columns={1}
    >
      <FormFieldFrame
        label={LABELS.productVideoUrl}
        error={getError("videoUrl")}
      >
        <FileUpload
          entityType={UPLOAD_ENTITY.PRODUCTS}
          entityId={draftUploadId}
          purpose={UPLOAD_PURPOSE.VIDEO}
          valueUrl={values.videoUrl || null}
          onUploaded={(url) => patchValues({ videoUrl: url })}
          disabled={disabled}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productSizeChart}
        error={getError("sizeChartUrl")}
      >
        <FileUpload
          entityType={UPLOAD_ENTITY.PRODUCTS}
          entityId={draftUploadId}
          purpose={UPLOAD_PURPOSE.SIZE_CHART}
          valueUrl={values.sizeChartUrl || null}
          onUploaded={(url) => patchValues({ sizeChartUrl: url })}
          disabled={disabled}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
