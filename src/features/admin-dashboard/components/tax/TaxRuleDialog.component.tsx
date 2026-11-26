"use client";

import type { FormEvent } from "react";
import type { CategoryOptionData } from "@/features/products";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormActions } from "@/shared/components/forms";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import type { TaxRuleRow } from "../../api/tax/tax.api";
import { adminTaxStyles as styles } from "../../styles/tax/adminTax.styles";
import { useTaxRuleForm } from "../../hooks/tax/useTaxRuleForm.hook";
import { TaxRuleFormFields } from "./TaxRuleFormFields.component";

interface TaxRuleDialogProps {
  open: boolean;
  /** The rule being edited; without it the dialog adds one. */
  rule: TaxRuleRow | null;
  /** Pre-selects this category when adding (opened from a category). */
  initialCategory?: CategoryOptionData | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

function TaxRuleDialogBody({
  rule,
  initialCategory = null,
  onSaved,
  onCancel,
}: Pick<TaxRuleDialogProps, "rule" | "initialCategory" | "onSaved"> & {
  onCancel: () => void;
}) {
  const form = useTaxRuleForm({ rule, initialCategory, onSaved });
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void form.submit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <TaxRuleFormFields
        values={form.values}
        category={form.category}
        errors={form.errors}
        nonStandardRate={form.nonStandardRate}
        ratePercent={form.ratePercent}
        disabled={form.saving}
        onPatch={form.patch}
        onSelectCategory={form.selectCategory}
        onClearCategory={form.clearCategory}
      />
      <FormError
        error={form.submitError}
        fallback={LABELS.couldNotCreateTaxRule}
      />
      <FormActions>
        <Button
          type="button"
          variant="secondary"
          fullWidth="mobile"
          disabled={form.saving}
          onClick={onCancel}
        >
          {LABELS.cancel}
        </Button>
        <DisabledActionHint
          disabled={form.saveBlockedReason !== null && !form.saving}
          message={form.saveBlockedReason ?? ""}
        >
          <Button
            type="submit"
            fullWidth="mobile"
            loading={form.saving}
            disabled={form.saveBlockedReason !== null}
          >
            {LABELS.taxRuleSave}
          </Button>
        </DisabledActionHint>
      </FormActions>
    </form>
  );
}

/** Add or edit a tax rule. The body mounts only while open, so each opening starts from a clean form. */
export function TaxRuleDialog({
  open,
  rule,
  initialCategory = null,
  onOpenChange,
  onSaved,
}: TaxRuleDialogProps) {
  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>
            {rule ? LABELS.taxRuleEditTitle : LABELS.taxRuleAddTitle}
          </DialogTitle>
          <DialogDescription>
            {rule ? LABELS.taxRuleEditBody : LABELS.taxRuleAddBody}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <TaxRuleDialogBody
            rule={rule}
            initialCategory={initialCategory}
            onSaved={onSaved}
            onCancel={handleCancel}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
