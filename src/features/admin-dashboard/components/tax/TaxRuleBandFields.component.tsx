"use client";

import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { LABELS } from "@/shared/constants/labels";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import type {
  TaxRuleFormErrors,
  TaxRuleFormValues,
} from "../../utils/tax/taxRuleForm";
import { adminTaxStyles as styles } from "../../styles/tax/adminTax.styles";

interface TaxRuleBandFieldsProps {
  values: TaxRuleFormValues;
  errors: TaxRuleFormErrors;
  disabled: boolean;
  onPatch: (next: Partial<TaxRuleFormValues>) => void;
}

/** A GST rate that changes above a price per piece. */
export function TaxRuleBandFields({
  values,
  errors,
  disabled,
  onPatch,
}: TaxRuleBandFieldsProps) {
  const handleThreshold = (value: number | undefined) =>
    onPatch({ priceBandThreshold: value == null ? "" : String(value) });
  const handleAbove = (value: number | undefined) =>
    onPatch({ gstPercentageAbove: value == null ? "" : String(value) });

  return (
    <FormSection
      title={LABELS.taxRuleSectionBand}
      hint={LABELS.gstPriceBandHint}
      contentClassName={styles.sectionContent}
    >
      <FormFieldFrame label={LABELS.gstPriceBandThreshold} error={errors.band}>
        <NumberInput
          value={
            values.priceBandThreshold === ""
              ? undefined
              : Number(values.priceBandThreshold)
          }
          min={0}
          step={100}
          prefix={CURRENCY_SYMBOL}
          placeholder={LABELS.gstBandOptional}
          disabled={disabled}
          onChange={handleThreshold}
        />
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.gstPercentageAbove}>
        <NumberInput
          value={
            values.gstPercentageAbove === ""
              ? undefined
              : Number(values.gstPercentageAbove)
          }
          min={0}
          max={100}
          step={0.25}
          suffix="%"
          placeholder={LABELS.gstBandOptional}
          disabled={disabled}
          onChange={handleAbove}
        />
      </FormFieldFrame>
    </FormSection>
  );
}
