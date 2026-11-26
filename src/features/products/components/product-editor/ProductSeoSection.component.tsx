"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import {
  type ProductListingFormField,
  type ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";
import { SeoSearchPreview } from "./SeoSearchPreview.component";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";

interface ProductSeoSectionProps {
  values: ProductListingFormValues;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
}

export function ProductSeoSection({
  values,
  disabled,
  getError,
  patchValues,
}: ProductSeoSectionProps) {
  const handleSeoTitleChange = (event: ChangeEvent<HTMLInputElement>) =>
    patchValues({ seoTitle: event.target.value });
  const handleSeoDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => patchValues({ seoDescription: event.target.value });

  return (
    <FormSection
      title={LABELS.productFormSectionSeo}
      hint={LABELS.productFormSectionSeoHint}
      columns={1}
      contentClassName={productEditorFormStyles.seoSectionContent}
    >
      <FormFieldFrame
        counter={{
          value: values.seoTitle,
          max: PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX,
        }}
        label={LABELS.productSeoTitle}
        hint={LABELS.productSeoTitleHint}
        error={getError("seoTitle")}
      >
        <Input
          value={values.seoTitle}
          placeholder={values.name}
          maxLength={PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX}
          error={Boolean(getError("seoTitle"))}
          disabled={disabled}
          onChange={handleSeoTitleChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        counter={{
          value: values.seoDescription,
          max: PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX,
        }}
        label={LABELS.productSeoDescription}
        hint={LABELS.productSeoDescriptionHint}
        error={getError("seoDescription")}
      >
        <Textarea
          value={values.seoDescription}
          placeholder={LABELS.productSeoDescriptionPlaceholder}
          maxLength={PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX}
          error={Boolean(getError("seoDescription"))}
          disabled={disabled}
          onChange={handleSeoDescriptionChange}
          className={productEditorFormStyles.seoDescriptionTextarea}
        />
      </FormFieldFrame>
      <SeoSearchPreview values={values} />
    </FormSection>
  );
}
