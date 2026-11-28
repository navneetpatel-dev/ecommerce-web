"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_FIELD_LIMITS } from "../../constants/listing-form/productFields";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";
import type {
  CategoryOptionData,
  PriceGuide,
  PricingLock,
  ProductEditorFormProps,
} from "../../types/product-editor/types";
import { ProductCategorySelect } from "./ProductCategorySelect.component";
import { ProductPriceFields } from "./ProductPriceFields.component";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";

interface ProductDetailsSectionProps {
  values: ProductListingFormValues;
  category: ProductEditorFormProps["category"];
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
  /** What customers will pay, GST included (server-computed), and the hints built from it. */
  priceGuide: PriceGuide;
  /** Set by the editor for platform admins; vendors are never locked. */
  pricingLock?: PricingLock;
}

export function ProductDetailsSection({
  values,
  category,
  disabled,
  getError,
  patchValues,
  priceGuide,
  pricingLock,
}: ProductDetailsSectionProps) {
  const locked = pricingLock?.locked ?? false;
  const isPriceDisabled = disabled || locked;
  // The category sets the GST rate and commission, so it locks with the price.
  const categoryLockHint = locked ? pricingLock?.hint : undefined;

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ name: event.target.value });
  };

  const handleBrandChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ brand: event.target.value });
  };

  const handleCategorySelect = (selected: CategoryOptionData) => {
    patchValues({ categoryId: selected.id });
    category.onSelect(selected);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    patchValues({ description: event.target.value });
  };

  return (
    <FormSection
      title={LABELS.productFormSectionDetails}
      hint={LABELS.productFormSectionDetailsHint}
      contentClassName={productEditorFormStyles.detailsContent}
    >
      <FormFieldFrame
        className={productEditorFormStyles.colSpan2}
        counter={{ value: values.name, max: PRODUCT_FIELD_LIMITS.NAME_MAX }}
        label={LABELS.productName}
        required
        error={getError("name")}
      >
        <Input
          placeholder={LABELS.productNamePlaceholder}
          value={values.name}
          maxLength={PRODUCT_FIELD_LIMITS.NAME_MAX}
          error={Boolean(getError("name"))}
          disabled={disabled}
          onChange={handleNameChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.selectCategory}
        required
        hint={categoryLockHint}
        error={getError("categoryId")}
      >
        <ProductCategorySelect
          value={values.categoryId}
          selected={category.selected}
          onSelect={handleCategorySelect}
          error={Boolean(getError("categoryId"))}
          disabled={isPriceDisabled}
        />
      </FormFieldFrame>
      <FormFieldFrame
        counter={{ value: values.brand, max: PRODUCT_FIELD_LIMITS.BRAND_MAX }}
        label={LABELS.productBrand}
        error={getError("brand")}
      >
        <Input
          placeholder={LABELS.productBrandPlaceholder}
          value={values.brand}
          maxLength={PRODUCT_FIELD_LIMITS.BRAND_MAX}
          error={Boolean(getError("brand"))}
          disabled={disabled}
          onChange={handleBrandChange}
        />
      </FormFieldFrame>
      <ProductPriceFields
        values={values}
        disabled={disabled}
        getError={getError}
        patchValues={patchValues}
        priceGuide={priceGuide}
        pricingLock={pricingLock}
      />
      <FormFieldFrame
        counter={{
          value: values.description,
          max: PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX,
        }}
        label={LABELS.shortDescription}
        required
        error={getError("description")}
        className={productEditorFormStyles.colSpan2}
      >
        <Textarea
          placeholder={LABELS.shortDescription}
          value={values.description}
          maxLength={PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX}
          error={Boolean(getError("description"))}
          disabled={disabled}
          onChange={handleDescriptionChange}
          className={productEditorFormStyles.descriptionTextarea}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
