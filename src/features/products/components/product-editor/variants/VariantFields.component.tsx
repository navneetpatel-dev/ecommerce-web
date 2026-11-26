"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { LABELS } from "@/shared/constants/labels";
import {
  PRODUCT_FIELD_LIMITS,
  VARIANT_LIMITS,
  VARIANT_OPTIONS_MAX_CHARS,
} from "../../../constants/listing-form/productFields";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";
import { variantsEditorStyles } from "../../../styles/product-editor/variantsEditor.styles";

interface VariantFieldsProps {
  draft: VariantDraft;
  errors?: VariantDraftErrors;
  disabled?: boolean;
  /** An existing variant keeps its SKU. */
  skuLocked?: boolean;
  priceLocked?: boolean;
  onChange: (patch: Partial<VariantDraft>) => void;
}

/** The four inputs of one variant: SKU, price, stock and options. */
export function VariantFields({
  draft,
  errors,
  disabled = false,
  skuLocked = false,
  priceLocked = false,
  onChange,
}: VariantFieldsProps) {
  const handleSku = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ sku: event.target.value });
  const handlePrice = (value: number | undefined) =>
    onChange({ price: value == null ? "" : String(value) });
  const handleStock = (value: number | undefined) =>
    onChange({ stock: value == null ? "" : String(value) });
  const handleOptions = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ options: event.target.value });

  return (
    <div className={variantsEditorStyles.fields}>
      <FormFieldFrame
        counter={{ value: draft.sku, max: VARIANT_LIMITS.SKU_MAX }}
        label={LABELS.variantSku}
        error={errors?.sku}
      >
        <Input
          value={draft.sku}
          maxLength={VARIANT_LIMITS.SKU_MAX}
          disabled={disabled || skuLocked}
          error={Boolean(errors?.sku)}
          onChange={handleSku}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.variantPrice} error={errors?.price}>
        <NumberInput
          prefix={CURRENCY_SYMBOL}
          min={1}
          max={PRODUCT_FIELD_LIMITS.PRICE_MAX}
          step={1}
          value={draft.price === "" ? undefined : Number(draft.price)}
          disabled={disabled || priceLocked}
          error={Boolean(errors?.price)}
          onChange={handlePrice}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.variantStock} error={errors?.stock}>
        <NumberInput
          min={0}
          max={VARIANT_LIMITS.STOCK_MAX}
          step={1}
          value={draft.stock === "" ? undefined : Number(draft.stock)}
          disabled={disabled}
          onChange={handleStock}
        />
      </FormFieldFrame>
      <FormFieldFrame
        className={variantsEditorStyles.fieldWide}
        label={LABELS.variantOptions}
        hint={LABELS.variantOptionsHint}
        error={errors?.options}
      >
        <Input
          value={draft.options}
          placeholder="Size: M; Colour: Red"
          maxLength={VARIANT_OPTIONS_MAX_CHARS}
          error={Boolean(errors?.options)}
          disabled={disabled}
          className={variantsEditorStyles.rowReadOnlySku}
          onChange={handleOptions}
        />
      </FormFieldFrame>
    </div>
  );
}
