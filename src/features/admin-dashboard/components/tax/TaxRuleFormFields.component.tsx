"use client";

import type { ChangeEvent } from "react";
import { TriangleAlert } from "lucide-react";
import {
  CategoryPickerSelect,
  type CategoryOptionData,
} from "@/features/products";
import {
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import {
  GST_OTHER,
  GST_SLAB_CHOICES,
  type TaxRuleFormErrors,
  type TaxRuleFormValues,
} from "../../utils/tax/taxRuleForm";
import { adminTaxStyles as styles } from "../../styles/tax/adminTax.styles";

interface TaxRuleFormFieldsProps {
  values: TaxRuleFormValues;
  category: CategoryOptionData | null;
  errors: TaxRuleFormErrors;
  nonStandardRate: boolean;
  /** The rate the form stands for, or null while it is not a number. */
  ratePercent: number | null;
  /** Editing a category rule keeps its category (move it to the default instead). */
  categoryLocked?: boolean;
  /** Editing the platform default, which stays the default. */
  isDefaultRule?: boolean;
  disabled?: boolean;
  onPatch: (next: Partial<TaxRuleFormValues>) => void;
  onSelectCategory: (category: CategoryOptionData) => void;
  onClearCategory: () => void;
}

/** The fields of a tax rule: category (or platform default), GST slab, HSN code and the price band. */
export function TaxRuleFormFields({
  values,
  category,
  errors,
  nonStandardRate,
  ratePercent,
  categoryLocked = false,
  isDefaultRule = false,
  disabled = false,
  onPatch,
  onSelectCategory,
  onClearCategory,
}: TaxRuleFormFieldsProps) {
  const handleChoice = (choice: string) => onPatch({ gstChoice: choice });
  const handleCustom = (value: number | undefined) =>
    onPatch({ gstCustom: value == null ? "" : String(value) });
  const handleHsn = (event: ChangeEvent<HTMLInputElement>) =>
    onPatch({ hsnCode: event.target.value.replace(/\D/g, "").slice(0, 8) });
  const handleThreshold = (value: number | undefined) =>
    onPatch({ priceBandThreshold: value == null ? "" : String(value) });
  const handleAbove = (value: number | undefined) =>
    onPatch({ gstPercentageAbove: value == null ? "" : String(value) });

  return (
    <FormStack>
      <FormSection
        title={LABELS.taxRuleSectionScope}
        columns={1}
        contentClassName={styles.sectionContent}
      >
        <FormFieldFrame
          label={LABELS.taxRuleCategory}
          hint={
            isDefaultRule
              ? LABELS.taxRuleDefaultScopeHint
              : LABELS.taxRuleCategoryHint
          }
        >
          <CategoryPickerSelect
            value={values.categoryId}
            selected={category}
            onSelect={onSelectCategory}
            onClear={onClearCategory}
            noneLabel={LABELS.taxRuleCategoryPlaceholder}
            disabled={disabled || categoryLocked || isDefaultRule}
          />
        </FormFieldFrame>
      </FormSection>

      <FormSection
        title={LABELS.taxRuleSectionRate}
        contentClassName={styles.sectionContent}
      >
        <FormFieldFrame
          label={LABELS.taxRuleGstSlab}
          error={errors.gst}
          required
        >
          <Select
            value={values.gstChoice}
            onValueChange={handleChoice}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GST_SLAB_CHOICES.map((slab) => (
                <SelectItem key={slab} value={slab}>
                  {slab}%
                </SelectItem>
              ))}
              <SelectItem value={GST_OTHER}>
                {LABELS.taxRuleGstOther}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>

        {values.gstChoice === GST_OTHER ? (
          <FormFieldFrame label={LABELS.taxRuleGstCustom} required>
            <NumberInput
              value={
                values.gstCustom === "" ? undefined : Number(values.gstCustom)
              }
              min={0}
              max={100}
              step={0.25}
              suffix="%"
              disabled={disabled}
              onChange={handleCustom}
            />
          </FormFieldFrame>
        ) : null}

        <FormFieldFrame
          label={LABELS.hsnOptional}
          hint={LABELS.taxRuleHsnHint}
          error={errors.hsn}
          counter={{ value: values.hsnCode, max: 8 }}
        >
          <Input
            value={values.hsnCode}
            inputMode="numeric"
            maxLength={8}
            disabled={disabled}
            error={Boolean(errors.hsn)}
            onChange={handleHsn}
          />
        </FormFieldFrame>

        {nonStandardRate ? (
          <p role="status" className={styles.warning}>
            <TriangleAlert className={styles.warningIcon} aria-hidden />
            {LABELS.taxRuleGstNonStandard}
          </p>
        ) : ratePercent !== null ? (
          <p className={styles.rateNote}>
            {formatLabel(LABELS.taxRuleRateNote, {
              percent: String(ratePercent),
            })}
          </p>
        ) : null}
      </FormSection>

      <FormSection
        title={LABELS.taxRuleSectionBand}
        hint={LABELS.gstPriceBandHint}
        contentClassName={styles.sectionContent}
      >
        <FormFieldFrame
          label={LABELS.gstPriceBandThreshold}
          error={errors.band}
        >
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
    </FormStack>
  );
}
