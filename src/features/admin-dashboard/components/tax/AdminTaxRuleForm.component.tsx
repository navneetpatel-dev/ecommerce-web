"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormError } from "@/shared/components/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { adminFormWidgetsStyles } from "../../styles/shared/adminFormWidgets.styles";

interface AdminTaxRuleFormProps {
  gstPercentage: string;
  hsnCode: string;
  createError?: string | null;
  onGstChange: (value: string) => void;
  onHsnChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function AdminTaxRuleForm({
  gstPercentage,
  hsnCode,
  createError = null,
  onGstChange,
  onHsnChange,
  onSubmit,
}: AdminTaxRuleFormProps) {
  const canCreate = gstPercentage.trim() !== "" && Number(gstPercentage) >= 0;

  return (
    <form
      onSubmit={(e) => {
        if (!canCreate) {
          e.preventDefault();
          return;
        }
        onSubmit(e);
      }}
    >
      <FormSection title={LABELS.addTaxRule} columns={2}>
        <FormFieldFrame label={LABELS.gstPercentage}>
          <NumberInput
            value={gstPercentage === "" ? undefined : Number(gstPercentage)}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            placeholder={LABELS.gstPercentage}
            onChange={(value) =>
              onGstChange(value == null ? "" : String(value))
            }
          />
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.hsnOptional}>
          <Input
            placeholder={LABELS.hsnOptional}
            value={hsnCode}
            onChange={(e) => onHsnChange(e.target.value)}
          />
        </FormFieldFrame>
        <FormError
          error={createError}
          fallback={LABELS.couldNotCreateTaxRule}
        />
        <FormActions className={adminFormWidgetsStyles.colSpan2}>
          <DisabledActionHint
            disabled={!canCreate}
            message={LABELS.enterGstPercentage}
          >
            <Button type="submit" fullWidth="mobile" disabled={!canCreate}>
              {LABELS.addTaxRule}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormSection>
    </form>
  );
}
