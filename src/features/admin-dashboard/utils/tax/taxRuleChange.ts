import { LABELS } from "@/shared/constants/labels";
import type { TaxRuleChange, TaxRuleRow } from "../../api/tax/tax.api";
import {
  toTaxRuleBody,
  validateTaxRule,
  valuesFromRule,
  type TaxRuleFormValues,
} from "./taxRuleForm";

/** The change a tax rule form is proposing, once it is complete and differs from what is saved. */
export function proposedTaxRuleChange(
  rule: TaxRuleRow | null,
  values: TaxRuleFormValues,
): TaxRuleChange | null {
  const errors = validateTaxRule(values, {
    gst: LABELS.enterGstPercentage,
    hsn: LABELS.taxRuleHsnInvalid,
    band: LABELS.gstPriceBandIncomplete,
  });
  if (Object.keys(errors).length) return null;
  const body = toTaxRuleBody(values);
  if (!rule) return { action: "create", rule: body };
  const unchanged =
    JSON.stringify(body) ===
    JSON.stringify(toTaxRuleBody(valuesFromRule(rule)));
  return unchanged ? null : { action: "update", ruleId: rule.id, rule: body };
}
