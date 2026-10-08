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
import { WARRANTY_TYPE } from "@/shared/constants/statuses";
import {
  PRODUCT_FIELD_LIMITS,
  type ProductCodMode,
  type ProductListingFormField,
  type ProductListingFormValues,
} from "@/features/products";
import { vendorProductCreateFormStyles } from "../../../styles/products/vendorProductCreateForm.styles";

interface ProductPoliciesSectionProps {
  values: ProductListingFormValues;
  disabled: boolean;
  getError: (field: ProductListingFormField) => string | undefined;
  patchValues: (patch: Partial<ProductListingFormValues>) => void;
}

export function ProductPoliciesSection({
  values,
  disabled,
  getError,
  patchValues,
}: ProductPoliciesSectionProps) {
  const handleDeliveryNoteChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    patchValues({ deliveryNote: event.target.value });
  };

  const handleReturnNoteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    patchValues({ returnNote: event.target.value });
  };

  const handleWarrantyMonthsChange = (value: number | undefined) => {
    patchValues({ warrantyMonths: value == null ? "" : String(value) });
  };

  const handleWarrantyTypeChange = (value: string) => {
    patchValues({ warrantyType: value === "__inherit__" ? "" : value });
  };

  const handleHsnCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchValues({ hsnCode: event.target.value });
  };

  const handleCodModeChange = (value: string) => {
    patchValues({ codMode: value as ProductCodMode });
  };

  return (
    <FormSection
      title={LABELS.productFormSectionPolicies}
      hint={LABELS.productFormSectionPoliciesHint}
    >
      <FormFieldFrame
        label={LABELS.productDeliveryNote}
        hint={LABELS.productDeliveryNoteHint}
        error={getError("deliveryNote")}
      >
        <Textarea
          value={values.deliveryNote}
          maxLength={PRODUCT_FIELD_LIMITS.NOTE_MAX}
          error={Boolean(getError("deliveryNote"))}
          disabled={disabled}
          onChange={handleDeliveryNoteChange}
          className={vendorProductCreateFormStyles.policyTextarea}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productReturnNote}
        hint={LABELS.productReturnNoteHint}
        error={getError("returnNote")}
      >
        <Textarea
          value={values.returnNote}
          maxLength={PRODUCT_FIELD_LIMITS.NOTE_MAX}
          error={Boolean(getError("returnNote"))}
          disabled={disabled}
          onChange={handleReturnNoteChange}
          className={vendorProductCreateFormStyles.policyTextarea}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productWarrantyMonths}
        hint={LABELS.productWarrantyMonthsHint}
        error={getError("warrantyMonths")}
      >
        <NumberInput
          value={
            values.warrantyMonths === ""
              ? undefined
              : Number(values.warrantyMonths)
          }
          min={0}
          max={PRODUCT_FIELD_LIMITS.WARRANTY_MONTHS_MAX}
          step={1}
          disabled={disabled}
          onChange={handleWarrantyMonthsChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productWarrantyType}
        error={getError("warrantyType")}
      >
        <Select
          value={values.warrantyType || "__inherit__"}
          onValueChange={handleWarrantyTypeChange}
        >
          <SelectTrigger disabled={disabled}>
            <SelectValue placeholder={LABELS.inheritDefault} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__inherit__">{LABELS.inheritDefault}</SelectItem>
            <SelectItem value={WARRANTY_TYPE.MANUFACTURER}>
              {LABELS.warrantyManufacturer}
            </SelectItem>
            <SelectItem value={WARRANTY_TYPE.SELLER}>
              {LABELS.warrantySeller}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productHsnCode}
        hint={LABELS.productHsnCodeHint}
        error={getError("hsnCode")}
      >
        <Input
          value={values.hsnCode}
          maxLength={PRODUCT_FIELD_LIMITS.HSN_MAX}
          error={Boolean(getError("hsnCode"))}
          disabled={disabled}
          onChange={handleHsnCodeChange}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.productCodEnabled}
        error={getError("codMode")}
      >
        <Select value={values.codMode} onValueChange={handleCodModeChange}>
          <SelectTrigger disabled={disabled}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inherit">{LABELS.productCodInherit}</SelectItem>
            <SelectItem value="on">{LABELS.productCodOn}</SelectItem>
            <SelectItem value="off">{LABELS.productCodOff}</SelectItem>
          </SelectContent>
        </Select>
      </FormFieldFrame>
    </FormSection>
  );
}
