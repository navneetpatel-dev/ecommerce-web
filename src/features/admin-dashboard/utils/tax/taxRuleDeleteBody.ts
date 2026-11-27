import { LABELS } from "@/shared/constants/labels";
import type { TaxRuleRow } from "../../api/tax/tax.api";

/** Who a deleted tax rule affects, worded for one category or several. */
export function taxRuleDeleteBody({
  isDefault,
  appliesToCount,
}: Pick<TaxRuleRow, "isDefault" | "appliesToCount">): string {
  const single = appliesToCount === 1;
  if (isDefault) {
    return single
      ? LABELS.taxRuleDeleteDefaultBodyOne
      : LABELS.taxRuleDeleteDefaultBody;
  }
  return single
    ? LABELS.taxRuleDeleteCategoryBodyOne
    : LABELS.taxRuleDeleteCategoryBody;
}
