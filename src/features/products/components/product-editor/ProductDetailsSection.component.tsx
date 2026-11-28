"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import { useIsVendorStaff } from "../../hooks/product-editor/useIsVendorStaff.hook";
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
import { CustomerPricePreview } from "./CustomerPricePreview.component";
import { ProductPricingGroup } from "./ProductPricingGroup.component";
import { ProductCategorySelect } from "./ProductCategorySelect.component";
import { productEditorFormStyles } from "../../styles/product-editor/productEditorForm.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";

interface ProductDetailsSectionProps {
  values: ProductListingFormValues;
  category: ProductEditorFormProps["category"];
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
  /** What customers will pay, GST included (server-computed), and the hints built from it. */
  priceGuide: PriceGuide;
  /** Set by the editor for platform admins; without it, vendor staff are locked out. */
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
  const isStaff = useIsVendorStaff();
  const locked = pricingLock?.locked ?? isStaff;
  const isPriceDisabled = disabled || locked;
  // The category sets the GST rate and commission, so it locks with the price.
  const categoryLockHint = locked
    ? (pricingLock?.hint ?? LABELS.productOwnerOnlyHint)
    : undefined;

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ name: event.target.value });
  };

  const handlePriceChange = (value: number | undefined) => {
    patchValues({ price: value == null ? "" : String(value) });
  };

  const customerPrice = priceGuide.customerPrice;
  const mrp =
    values.compareAtPrice === "" ? null : Number(values.compareAtPrice);
  // Comparable without a category: an MRP below the selling price itself can never be right.
  const sellingPrice = values.price === "" ? null : Number(values.price);
  const mrpBelowPrice =
    mrp !== null && sellingPrice !== null && mrp < sellingPrice
      ? formatLabel(LABELS.productMrpBelowPrice, { price: values.price })
      : undefined;
  const mrpTooLow =
    customerPrice !== null && mrp !== null && mrp < customerPrice;
  const mrpBelowMinimum =
    mrpTooLow && customerPrice !== null
      ? formatLabel(LABELS.productMrpBelowCustomerPrice, {
          amount: formatInrAmount(customerPrice),
        })
      : undefined;
  const handleUseCustomerPrice = () => {
    if (customerPrice !== null) {
      patchValues({ compareAtPrice: String(customerPrice) });
    }
  };
  const showUseCustomerPrice =
    customerPrice !== null && !locked && (mrp === null || mrpTooLow);
  const useCustomerPriceButton = showUseCustomerPrice ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={handleUseCustomerPrice}
    >
      {formatLabel(LABELS.productUseCustomerPriceAsMrp, {
        amount: formatInrAmount(customerPrice),
      })}
    </Button>
  ) : undefined;

  const handleCompareAtPriceChange = (value: number | undefined) => {
    patchValues({ compareAtPrice: value == null ? "" : String(value) });
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
      <ProductPricingGroup
        preview={
          <CustomerPricePreview
            preview={priceGuide.preview}
            missing={priceGuide.missing}
          />
        }
      >
        <FormFieldFrame
          label={LABELS.productPriceExclGst}
          hint={
            locked
              ? (pricingLock?.hint ??
                "Base product pricing is configured exclusively by the store owner.")
              : priceGuide.priceHint
          }
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
            disabled={isPriceDisabled}
            onChange={handlePriceChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.productMrpInclGst}
          hint={
            locked
              ? (pricingLock?.hint ??
                "MRP is configured exclusively by the store owner.")
              : priceGuide.mrpHint
          }
          error={getError("compareAtPrice") ?? mrpBelowPrice ?? mrpBelowMinimum}
          footerAction={useCustomerPriceButton}
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
            disabled={isPriceDisabled}
            onChange={handleCompareAtPriceChange}
          />
        </FormFieldFrame>
      </ProductPricingGroup>
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
