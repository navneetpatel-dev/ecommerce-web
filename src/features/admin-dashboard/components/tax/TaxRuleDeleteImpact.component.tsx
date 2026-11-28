"use client";

import { useTaxRuleImpact } from "../../hooks/tax/useTaxRuleImpact.hook";
import { MrpImpactNotice } from "../shared/MrpImpactNotice.component";

/** Inside the delete confirmation: what removing the rule would take off sale. */
export function TaxRuleDeleteImpact({ ruleId }: { ruleId: string }) {
  const impact = useTaxRuleImpact({ action: "delete", ruleId });
  return <MrpImpactNotice impact={impact} />;
}
