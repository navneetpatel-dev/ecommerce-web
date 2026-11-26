"use client";

import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormActions, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { ProductCatalogSection } from "./ProductCatalogSection.component";
import { ProductDetailsSection } from "./ProductDetailsSection.component";
import { ProductImagesSection } from "./ProductImagesSection.component";
import { ProductMediaSection } from "./ProductMediaSection.component";
import { ProductPoliciesSection } from "./ProductPoliciesSection.component";
import { PriceChangeReasonField } from "./PriceChangeReasonField.component";
import { ProductVariantsEditor } from "./variants/ProductVariantsEditor.component";
import { ProductSeoSection } from "./ProductSeoSection.component";
import { ProductEditorFormSkeleton } from "./ProductEditorFormSkeleton.component";
import { useProductFormController } from "../../hooks/product-editor/useProductFormController.hook";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";
import type { ProductEditorFormProps } from "../../types/product-editor/types";

export function ProductEditorForm({
  mode,
  values,
  category,
  imageUrls,
  draftUploadId,
  submitError,
  apiFieldErrors,
  submitting,
  loading = false,
  onChange,
  onImageUrlsChange,
  onValidSubmit,
  onCancel,
  pricingLock,
  vendorField,
  reason,
  variants,
}: ProductEditorFormProps) {
  const disabled = submitting || loading;
  const showImages = mode === "create";

  const {
    getError,
    canSubmit,
    disableHint,
    patchValues,
    handleSubmit,
    priceGuide,
  } = useProductFormController({
    values,
    loading,
    apiFieldErrors,
    onChange,
    onValidSubmit,
  });

  if (loading) {
    return <ProductEditorFormSkeleton />;
  }

  return (
    <form className={productEditorFormStyles.form} onSubmit={handleSubmit}>
      <FormStack>
        {vendorField}
        <ProductDetailsSection
          values={values}
          category={category}
          disabled={disabled}
          getError={getError}
          patchValues={patchValues}
          priceGuide={priceGuide}
          pricingLock={pricingLock}
        />

        <PriceChangeReasonField reason={reason} disabled={disabled} />

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
          pricingLock={pricingLock}
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

        {showImages && variants ? (
          <ProductVariantsEditor
            rows={variants.rows}
            errors={variants.errors}
            disabled={disabled}
            onChange={variants.onChange}
          />
        ) : null}

        {submitError ? (
          <p role="alert" className={productEditorFormStyles.submitError}>
            {submitError}
          </p>
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
