import {
  GST_SLABS,
  HSN_CODE_PATTERN,
  isStandardGstSlab,
} from "@/shared/constants/tax/gstSlabs";
import type { TaxRuleInput, TaxRuleRow } from "../../api/tax/tax.api";

/** What the tax rule form holds: strings, because inputs are strings. */
export interface TaxRuleFormValues {
  categoryId: string;
  /** A standard slab as text ("18"), or "other" to type a custom rate. */
  gstChoice: string;
  gstCustom: string;
  hsnCode: string;
  priceBandThreshold: string;
  gstPercentageAbove: string;
}

export const GST_OTHER = "other";

export interface TaxRuleFormErrors {
  gst?: string;
  hsn?: string;
  band?: string;
}

export function emptyTaxRuleValues(): TaxRuleFormValues {
  return {
    categoryId: "",
    gstChoice: "18",
    gstCustom: "",
    hsnCode: "",
    priceBandThreshold: "",
    gstPercentageAbove: "",
  };
}

/** The form for an existing rule: a standard rate selects its slab, anything else opens "Other". */
export function valuesFromRule(rule: TaxRuleRow): TaxRuleFormValues {
  const percent = Number(rule.gstPercentage);
  const standard = isStandardGstSlab(percent);
  return {
    categoryId: rule.categoryId ?? "",
    gstChoice: standard ? String(percent) : GST_OTHER,
    gstCustom: standard ? "" : String(percent),
    hsnCode: rule.hsnCode ?? "",
    priceBandThreshold:
      rule.priceBandThreshold != null ? String(rule.priceBandThreshold) : "",
    gstPercentageAbove:
      rule.gstPercentageAbove != null ? String(rule.gstPercentageAbove) : "",
  };
}

/** The rate the form currently stands for, or null while it is not a number. */
export function gstPercentOf(values: TaxRuleFormValues): number | null {
  const text =
    values.gstChoice === GST_OTHER ? values.gstCustom : values.gstChoice;
  if (text.trim() === "") return null;
  const percent = Number(text);
  return Number.isFinite(percent) ? percent : null;
}

/** True when the rate is a number but not one of the standard slabs (the form warns, never blocks). */
export function isNonStandardRate(values: TaxRuleFormValues): boolean {
  const percent = gstPercentOf(values);
  return percent !== null && !isStandardGstSlab(percent);
}

export const GST_SLAB_CHOICES = GST_SLABS.map(String);

const hasTwoDecimalsAtMost = (percent: number) =>
  Math.abs(percent * 100 - Math.round(percent * 100)) < 1e-9;

export function validateTaxRule(
  values: TaxRuleFormValues,
  messages: { gst: string; hsn: string; band: string },
): TaxRuleFormErrors {
  const errors: TaxRuleFormErrors = {};
  const percent = gstPercentOf(values);
  if (
    percent === null ||
    percent < 0 ||
    percent > 100 ||
    !hasTwoDecimalsAtMost(percent)
  ) {
    errors.gst = messages.gst;
  }
  if (values.hsnCode.trim() && !HSN_CODE_PATTERN.test(values.hsnCode.trim())) {
    errors.hsn = messages.hsn;
  }
  const hasThreshold = values.priceBandThreshold.trim() !== "";
  const hasAbove = values.gstPercentageAbove.trim() !== "";
  if (hasThreshold !== hasAbove) errors.band = messages.band;
  return errors;
}

export function toTaxRuleBody(values: TaxRuleFormValues): TaxRuleInput {
  const hasBand =
    values.priceBandThreshold.trim() !== "" &&
    values.gstPercentageAbove.trim() !== "";
  return {
    categoryId: values.categoryId || null,
    gstPercentage: gstPercentOf(values) ?? 0,
    hsnCode: values.hsnCode.trim() || null,
    priceBandThreshold: hasBand ? Number(values.priceBandThreshold) : null,
    gstPercentageAbove: hasBand ? Number(values.gstPercentageAbove) : null,
  };
}
