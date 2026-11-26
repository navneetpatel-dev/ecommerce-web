"use client";

import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import type { ChangeEvent } from "react";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";
import { ProductHighlightsEditor } from "./ProductHighlightsEditor.component";
import { ProductSpecsEditor } from "./ProductSpecsEditor.component";
import { Input } from "@/shared/components/ui/input";

interface ProductCatalogSectionProps {
  values: ProductListingFormValues;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
}

/** Room for the most tags allowed, each at its longest, plus the commas between them. */
const TAGS_INPUT_MAX =
  PRODUCT_FIELD_LIMITS.TAGS_MAX * (PRODUCT_FIELD_LIMITS.TAG_MAX + 2);

export function ProductCatalogSection({
  values,
  disabled,
  getError,
  patchValues,
}: ProductCatalogSectionProps) {
  const handleTagsInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ tagsInput: event.target.value });
  };

  const handleHighlightsChange = (
    highlights: ProductListingFormValues["highlights"],
  ) => {
    patchValues({ highlights });
  };

  const handleSpecsChange = (specs: ProductListingFormValues["specs"]) => {
    patchValues({ specs });
  };

  return (
    <FormSection
      title={LABELS.productFormSectionCatalog}
      hint={LABELS.productFormSectionCatalogHint}
      columns={1}
    >
      <FormFieldFrame
        label={LABELS.productTags}
        hint={LABELS.productTagsHint}
        error={getError("tagsInput")}
        counter={{ value: values.tagsInput, max: TAGS_INPUT_MAX }}
      >
        <Input
          maxLength={TAGS_INPUT_MAX}
          placeholder={LABELS.productTagsPlaceholder}
          value={values.tagsInput}
          error={Boolean(getError("tagsInput"))}
          disabled={disabled}
          onChange={handleTagsInputChange}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.productHighlights}
        hint={LABELS.productHighlightsHint}
        error={getError("highlights")}
      >
        <ProductHighlightsEditor
          highlights={values.highlights}
          disabled={disabled}
          hasError={Boolean(getError("highlights"))}
          onChange={handleHighlightsChange}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.specifications}
        hint={LABELS.productSpecsHint}
        error={getError("specs")}
      >
        <ProductSpecsEditor
          specs={values.specs}
          disabled={disabled}
          hasError={Boolean(getError("specs"))}
          onChange={handleSpecsChange}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
