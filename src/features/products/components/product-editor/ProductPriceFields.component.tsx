"use client";

import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  CURRENCY_SYMBOL,
  formatInrAmount,
} from "@/shared/utils/formatting/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import type {
  ProductListingFormField,
  ProductListingFormValues,
} from "../../schemas/listing-form/products.schema";
import type { PriceGuide, PricingLock } from "../../types/product-editor/types";
import { useProductPriceFields } from "../../hooks/product-editor/useProductPriceFields.hook";
import { CustomerPricePreview } from "./CustomerPricePreview.component";
import { ProductPricingGroup } from "./ProductPricingGroup.component";

interface ProductPriceFieldsProps {
  values: ProductListingFormValues;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
  priceGuide: PriceGuide;
  pricingLock?: PricingLock;
}

/** The selling price (before GST) and the MRP, beside what the customer will pay. */
export function ProductPriceFields({
  values,
  disabled,
  getError,
  patchValues,
  priceGuide,
  pricingLock,
}: ProductPriceFieldsProps) {
  const locked = pricingLock?.locked ?? false;
  const isPriceDisabled = disabled || locked;
  const {
    handlePriceChange,
    handleCompareAtPriceChange,
    handleUseCustomerPrice,
    showUseCustomerPrice,
    customerPrice,
    mrpError,
  } = useProductPriceFields({ values, patchValues, priceGuide, locked });
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

  return (
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
        hint={locked ? pricingLock?.hint : priceGuide.priceHint}
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
        hint={locked ? pricingLock?.hint : priceGuide.mrpHint}
        error={getError("compareAtPrice") ?? mrpError}
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
  );
}
