"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { TaxRuleRow } from "../../api/tax/tax.api";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";

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
  const body = formatLabel(
    rule.isDefault
      ? LABELS.taxRuleDeleteDefaultBody
      : LABELS.taxRuleDeleteCategoryBody,
    { name: rule.categoryName ?? "", count: String(rule.appliesToCount) },
  );

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={handleEdit}>
        <Pencil aria-hidden />
        {LABELS.edit}
      </Button>
      <AdminConfirmAction
        label={LABELS.delete}
        dialogVariant="danger"
        title={LABELS.confirmDeleteTaxTitle}
        description={body}
        onConfirm={handleDelete}
      />
    </>
  );
}
