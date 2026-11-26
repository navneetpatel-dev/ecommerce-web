"use client";

import { SeoFieldsSection } from "@/shared/components/forms/seo/SeoFieldsSection.component";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";

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
  const seoTitle = {
    value: values.seoTitle,
    error: getError("seoTitle"),
    onChange: (value: string) => patchValues({ seoTitle: value }),
  };
  const seoDescription = {
    value: values.seoDescription,
    error: getError("seoDescription"),
    onChange: (value: string) => patchValues({ seoDescription: value }),
  };
  return (
    <SeoFieldsSection
      seoTitle={seoTitle}
      seoDescription={seoDescription}
      fallbackTitle={values.name}
      fallbackDescription={values.description}
      disabled={disabled}
      idPrefix="product-seo"
    />
  );
}
