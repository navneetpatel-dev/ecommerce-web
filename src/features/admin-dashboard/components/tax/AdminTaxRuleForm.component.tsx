"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { adminFormWidgetsStyles } from "../../styles/shared/adminFormWidgets.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";

interface AdminTaxRuleFormProps {
  gstPercentage: string;
  hsnCode: string;
  priceBandThreshold: string;
  gstPercentageAbove: string;
  createError?: string | null;
  onGstChange: (value: string) => void;
  onHsnChange: (value: string) => void;
  onPriceBandThresholdChange: (value: string) => void;
  onGstPercentageAboveChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function AdminTaxRuleForm({
  gstPercentage,
  hsnCode,
  priceBandThreshold,
  gstPercentageAbove,
  createError = null,
  onGstChange,
  onHsnChange,
  onPriceBandThresholdChange,
  onGstPercentageAboveChange,
  onSubmit,
}: AdminTaxRuleFormProps) {
  // The price band is optional, but takes both its fields or neither.
  const bandComplete =
    (priceBandThreshold === "") === (gstPercentageAbove === "");
  const canCreate =
    gstPercentage.trim() !== "" && Number(gstPercentage) >= 0 && bandComplete;

  const handleSubmit = (event: FormEvent) => {
    if (!canCreate) {
      event.preventDefault();
      return;
    }
    onSubmit(event);
  };

  const handleGstPercentageChange = (value: number | undefined) => {
    onGstChange(value == null ? "" : String(value));
  };

  const handleHsnChange = (event: ChangeEvent<HTMLInputElement>) => {
    onHsnChange(event.target.value);
  };

  const handlePriceBandThresholdChange = (value: number | undefined) => {
    onPriceBandThresholdChange(value == null ? "" : String(value));
  };

  const handleGstPercentageAboveChange = (value: number | undefined) => {
    onGstPercentageAboveChange(value == null ? "" : String(value));
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title={LABELS.addTaxRule} columns={2}>
        <FormFieldFrame label={LABELS.gstPercentage}>
          <NumberInput
            value={gstPercentage === "" ? undefined : Number(gstPercentage)}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            placeholder={LABELS.gstPercentage}
            onChange={handleGstPercentageChange}
          />
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.hsnOptional}>
          <Input
            placeholder={LABELS.hsnOptional}
            value={hsnCode}
            onChange={handleHsnChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.gstPriceBandThreshold}
          hint={LABELS.gstPriceBandHint}
        >
          <NumberInput
            value={
              priceBandThreshold === "" ? undefined : Number(priceBandThreshold)
            }
            min={0}
            step={100}
            prefix={CURRENCY_SYMBOL}
            placeholder={LABELS.gstBandOptional}
            onChange={handlePriceBandThresholdChange}
          />
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.gstPercentageAbove}>
          <NumberInput
            value={
              gstPercentageAbove === "" ? undefined : Number(gstPercentageAbove)
            }
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            placeholder={LABELS.gstBandOptional}
            onChange={handleGstPercentageAboveChange}
          />
        </FormFieldFrame>
        <FormError
          error={createError}
          fallback={LABELS.couldNotCreateTaxRule}
        />
        <FormActions className={adminFormWidgetsStyles.colSpan2}>
          <DisabledActionHint
            disabled={!canCreate}
            message={
              bandComplete
                ? LABELS.enterGstPercentage
                : LABELS.gstPriceBandIncomplete
            }
          >
            <Button type="submit" fullWidth="mobile" disabled={!canCreate}>
              {LABELS.addTaxRule}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormSection>
    </form>
  );
}
