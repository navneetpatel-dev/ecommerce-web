import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { TaxRuleRow } from "../../api/tax/tax.api";

export function TaxRuleScopeCell({ rule }: { rule: TaxRuleRow }) {
  return rule.isDefault ? (
    <Badge>{LABELS.taxRulePlatformDefault}</Badge>
  ) : (
    <span>{rule.categoryName}</span>
  );
}

export function TaxRuleAppliesToCell({ rule }: { rule: TaxRuleRow }) {
  return (
    <span>
      {rule.appliesToCount === 1
        ? LABELS.taxRuleAppliesToOne
        : formatLabel(LABELS.taxRuleAppliesToCount, {
            count: String(rule.appliesToCount),
          })}
    </span>
  );
}
