"use client";

import { FileUpload } from "@/shared/components/FileUpload";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";

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
  const handleVideoUploaded = (url: string) => patchValues({ videoUrl: url });
  const handleSizeChartUploaded = (url: string) =>
    patchValues({ sizeChartUrl: url });

  return (
    <FormSection
      title={LABELS.productFormSectionMedia}
      hint={LABELS.productFormSectionMediaHint}
      columns={1}
      contentClassName={productEditorFormStyles.mediaSectionContent}
    >
      <FormFieldFrame error={getError("videoUrl")}>
        <FileUpload
          entityType={UPLOAD_ENTITY.PRODUCTS}
          entityId={draftUploadId}
          purpose={UPLOAD_PURPOSE.VIDEO}
          valueUrl={values.videoUrl || null}
          onUploaded={handleVideoUploaded}
          disabled={disabled}
          variant="card"
          removable
          label={LABELS.productVideoUrl}
        />
      </FormFieldFrame>
      <FormFieldFrame error={getError("sizeChartUrl")}>
        <FileUpload
          entityType={UPLOAD_ENTITY.PRODUCTS}
          entityId={draftUploadId}
          purpose={UPLOAD_PURPOSE.SIZE_CHART}
          valueUrl={values.sizeChartUrl || null}
          onUploaded={handleSizeChartUploaded}
          disabled={disabled}
          variant="card"
          removable
          label={LABELS.productSizeChart}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
