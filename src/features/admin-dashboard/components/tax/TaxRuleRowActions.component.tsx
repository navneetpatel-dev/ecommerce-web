"use client";

import { Pencil } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { TaxRuleRow } from "../../api/tax/tax.api";
import { taxRuleDeleteBody } from "../../utils/tax/taxRuleDeleteBody";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { TaxRuleDeleteImpact } from "./TaxRuleDeleteImpact.component";

interface TaxRuleRowActionsProps {
  rule: TaxRuleRow;
  onEdit: (rule: TaxRuleRow) => void;
  onDelete: (rule: TaxRuleRow) => Promise<unknown>;
}

/** Edit and delete for one tax rule; the delete wording says who is affected. */
export function TaxRuleRowActions({
  rule,
  onEdit,
  onDelete,
}: TaxRuleRowActionsProps) {
  const handleEdit = () => onEdit(rule);
  const handleDelete = () => onDelete(rule);
  const body = formatLabel(taxRuleDeleteBody(rule), {
    name: rule.categoryName ?? "",
    count: String(rule.appliesToCount),
  });

  return (
    <>
      <RowActionButton
        kind="edit"
        icon={Pencil}
        label={LABELS.edit}
        onClick={handleEdit}
      />
      <AdminConfirmAction
        label={LABELS.delete}
        dialogVariant="danger"
        title={LABELS.confirmDeleteTaxTitle}
        description={
          <>
            {body}
            <TaxRuleDeleteImpact ruleId={rule.id} />
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  );
}
