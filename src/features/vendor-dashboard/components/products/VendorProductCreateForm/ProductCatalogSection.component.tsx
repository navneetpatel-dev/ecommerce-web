"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  emptySpecRow,
  PRODUCT_FIELD_LIMITS,
  type ProductListingFormField,
  type ProductListingFormValues,
} from "@/features/products";
import { vendorProductCreateFormStyles } from "../../../styles/products/vendorProductCreateForm.styles";

interface ProductCatalogSectionProps {
  values: ProductListingFormValues;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
}

export function ProductCatalogSection({
  values,
  disabled,
  getError,
  patchValues,
}: ProductCatalogSectionProps) {
  const highlightsAtMax =
    values.highlights.length >= PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX;
  const specsAtMax = values.specs.length >= PRODUCT_FIELD_LIMITS.SPECS_MAX;

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
      >
        <Input
          placeholder={LABELS.productTagsPlaceholder}
          value={values.tagsInput}
          error={Boolean(getError("tagsInput"))}
          disabled={disabled}
          onChange={(event) => patchValues({ tagsInput: event.target.value })}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.productHighlights}
        error={getError("highlights")}
      >
        <div className={vendorProductCreateFormStyles.listStack}>
          {values.highlights.map((item, index) => (
            <div
              key={`highlight-${index}`}
              className={vendorProductCreateFormStyles.highlightRow}
            >
              <Input
                value={item}
                maxLength={PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX}
                error={Boolean(getError("highlights"))}
                disabled={disabled}
                onChange={(event) => {
                  const highlights = [...values.highlights];
                  highlights[index] = event.target.value;
                  patchValues({ highlights });
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                onClick={() =>
                  patchValues({
                    highlights: values.highlights.filter(
                      (_, rowIndex) => rowIndex !== index,
                    ),
                  })
                }
                aria-label={formatLabel(LABELS.removeNamed, {
                  name: LABELS.productHighlights,
                })}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            disabled={disabled || highlightsAtMax}
            onClick={() =>
              patchValues({ highlights: [...values.highlights, ""] })
            }
          >
            <Plus aria-hidden />
            {LABELS.addProductHighlight}
          </Button>
        </div>
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.specifications} error={getError("specs")}>
        <div className={vendorProductCreateFormStyles.listStack}>
          {values.specs.map((row, index) => (
            <div
              key={`spec-${index}`}
              className={vendorProductCreateFormStyles.specRow}
            >
              <Input
                placeholder={LABELS.productSpecKey}
                value={row.key}
                maxLength={PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX}
                error={Boolean(getError("specs"))}
                disabled={disabled}
                onChange={(event) => {
                  const specs = values.specs.map((current, rowIndex) =>
                    rowIndex === index
                      ? { ...current, key: event.target.value }
                      : current,
                  );
                  patchValues({ specs });
                }}
              />
              <Input
                placeholder={LABELS.productSpecValue}
                value={row.value}
                maxLength={PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX}
                error={Boolean(getError("specs"))}
                disabled={disabled}
                onChange={(event) => {
                  const specs = values.specs.map((current, rowIndex) =>
                    rowIndex === index
                      ? { ...current, value: event.target.value }
                      : current,
                  );
                  patchValues({ specs });
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                onClick={() =>
                  patchValues({
                    specs: values.specs.filter(
                      (_, rowIndex) => rowIndex !== index,
                    ),
                  })
                }
                aria-label={formatLabel(LABELS.removeNamed, {
                  name: LABELS.specifications,
                })}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            disabled={disabled || specsAtMax}
            onClick={() =>
              patchValues({ specs: [...values.specs, emptySpecRow()] })
            }
          >
            <Plus aria-hidden />
            {LABELS.addProductSpecification}
          </Button>
        </div>
      </FormFieldFrame>
    </FormSection>
  );
}
