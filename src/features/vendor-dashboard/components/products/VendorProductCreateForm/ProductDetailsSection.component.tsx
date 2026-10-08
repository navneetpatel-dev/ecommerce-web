"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { PRODUCT_FIELD_LIMITS } from "@/features/products";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "@/features/products";
import { vendorProductCreateFormStyles } from "../../../styles/products/vendorProductCreateForm.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";

interface ProductDetailsSectionProps {
  values: ProductListingFormValues;
  categories: Array<{ id: string; name: string }>;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
  /** What customers will pay, GST included (server-computed). */
  priceHint: string;
}

export function ProductDetailsSection({
  values,
  categories,
  disabled,
  getError,
  patchValues,
  priceHint,
}: ProductDetailsSectionProps) {
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ name: event.target.value });
  };

  const handlePriceChange = (value: number | undefined) => {
    patchValues({ price: value == null ? "" : String(value) });
  };

  const handleCompareAtPriceChange = (value: number | undefined) => {
    patchValues({ compareAtPrice: value == null ? "" : String(value) });
  };

  const handleBrandChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ brand: event.target.value });
  };

  const handleCategoryChange = (value: string) => {
    patchValues({ categoryId: value });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    patchValues({ description: event.target.value });
  };

  return (
    <FormSection
      title={LABELS.productFormSectionDetails}
      hint={LABELS.productFormSectionDetailsHint}
    >
      <FormFieldFrame
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
        label={LABELS.productPriceExclGst}
        hint={priceHint}
        required
        error={getError("price")}
      >
        <NumberInput
          prefix={CURRENCY_SYMBOL}
          min={1}
          step={1}
          placeholder={LABELS.productPriceExclGst}
          value={values.price === "" ? undefined : Number(values.price)}
          error={Boolean(getError("price"))}
          disabled={disabled}
          onChange={handlePriceChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productMrpInclGst}
        hint={LABELS.productMrpHint}
        error={getError("compareAtPrice")}
      >
        <NumberInput
          prefix={CURRENCY_SYMBOL}
          min={1}
          step={1}
          placeholder={LABELS.productMrpInclGst}
          value={
            values.compareAtPrice === ""
              ? undefined
              : Number(values.compareAtPrice)
          }
          error={Boolean(getError("compareAtPrice"))}
          disabled={disabled}
          onChange={handleCompareAtPriceChange}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.productBrand} error={getError("brand")}>
        <Input
          placeholder={LABELS.productBrandPlaceholder}
          value={values.brand}
          maxLength={PRODUCT_FIELD_LIMITS.BRAND_MAX}
          error={Boolean(getError("brand"))}
          disabled={disabled}
          onChange={handleBrandChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.selectCategory}
        required
        error={getError("categoryId")}
        className={vendorProductCreateFormStyles.colSpan2}
      >
        <Select
          value={values.categoryId || undefined}
          onValueChange={handleCategoryChange}
          disabled={disabled}
        >
          <SelectTrigger
            className={cn(
              getError("categoryId") &&
                vendorProductCreateFormStyles.selectCategoryTriggerError,
            )}
          >
            <SelectValue placeholder={LABELS.selectCategory} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.shortDescription}
        required
        error={getError("description")}
        className={vendorProductCreateFormStyles.colSpan2}
      >
        <Textarea
          placeholder={LABELS.shortDescription}
          value={values.description}
          maxLength={PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX}
          error={Boolean(getError("description"))}
          disabled={disabled}
          onChange={handleDescriptionChange}
          className={vendorProductCreateFormStyles.descriptionTextarea}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
