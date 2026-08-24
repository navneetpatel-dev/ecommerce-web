"use client";

import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormActions, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { ProductCatalogSection } from "./ProductCatalogSection.component";
import { ProductDetailsSection } from "./ProductDetailsSection.component";
import { ProductImagesSection } from "./ProductImagesSection.component";
import { ProductMediaSection } from "./ProductMediaSection.component";
import { ProductPoliciesSection } from "./ProductPoliciesSection.component";
import { ProductSeoSection } from "./ProductSeoSection.component";
import { useProductFormController } from "./useProductFormController.hook";
import type { VendorProductCreateFormProps } from "./types";

export function VendorProductCreateForm({
  mode,
  values,
  categories,
  imageUrls,
  draftUploadId,
  submitError,
  submitting,
  loading = false,
  onChange,
  onImageUrlsChange,
  onValidSubmit,
  onCancel,
}: VendorProductCreateFormProps) {
  const disabled = submitting || loading;
  const showImages = mode === "create";

  const { getError, canSubmit, disableHint, patchValues, handleSubmit } =
    useProductFormController({ values, loading, onChange, onValidSubmit });

  return (
    <form className="mb-5" onSubmit={handleSubmit}>
      <FormStack>
        <ProductDetailsSection
          values={values}
          categories={categories}
          disabled={disabled}
          getError={getError}
          patchValues={patchValues}
        />

        <ProductCatalogSection
          values={values}
          disabled={disabled}
          getError={getError}
          patchValues={patchValues}
        />

        <ProductPoliciesSection
          values={values}
          disabled={disabled}
          getError={getError}
          patchValues={patchValues}
        />

        <ProductMediaSection
          values={values}
          draftUploadId={draftUploadId}
          disabled={disabled}
          getError={getError}
          patchValues={patchValues}
        />

        <ProductSeoSection
          values={values}
          disabled={disabled}
          getError={getError}
          patchValues={patchValues}
        />

        {showImages ? (
          <ProductImagesSection
            imageUrls={imageUrls}
            draftUploadId={draftUploadId}
            disabled={disabled}
            onImageUrlsChange={onImageUrlsChange}
          />
        ) : null}

        {submitError ? (
          <p className="text-sm text-danger">{submitError}</p>
        ) : null}

        <FormActions>
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            {LABELS.cancel}
          </Button>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              disabled={!canSubmit || disabled}
              loading={submitting}
            >
              {mode === "edit"
                ? submitting
                  ? LABELS.updatingEllipsis
                  : LABELS.saveChanges
                : submitting
                  ? LABELS.creatingEllipsis
                  : LABELS.createProduct}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
