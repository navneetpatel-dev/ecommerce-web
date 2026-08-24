"use client";

import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import {
  PRODUCT_FIELD_LIMITS,
  type ProductListingFormField,
  type ProductListingFormValues,
} from "@/features/products";

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
  return (
    <FormSection
      title={LABELS.productFormSectionSeo}
      hint={LABELS.productFormSectionSeoHint}
    >
      <FormFieldFrame
        label={LABELS.productSeoTitle}
        error={getError("seoTitle")}
      >
        <Input
          value={values.seoTitle}
          maxLength={PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX}
          error={Boolean(getError("seoTitle"))}
          disabled={disabled}
          onChange={(event) => patchValues({ seoTitle: event.target.value })}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productSeoDescription}
        error={getError("seoDescription")}
      >
        <Textarea
          value={values.seoDescription}
          maxLength={PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX}
          error={Boolean(getError("seoDescription"))}
          disabled={disabled}
          onChange={(event) =>
            patchValues({ seoDescription: event.target.value })
          }
          className="min-h-[5.5rem]"
        />
      </FormFieldFrame>
    </FormSection>
  );
}
