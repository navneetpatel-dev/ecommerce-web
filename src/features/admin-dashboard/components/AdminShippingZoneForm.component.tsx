"use client";

import type { FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormError } from "@/shared/components/FormError.component";
import { LABELS } from "@/shared/constants/labels";

interface AdminShippingZoneFormProps {
  name: string;
  createError?: string | null;
  onNameChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function AdminShippingZoneForm({
  name,
  createError = null,
  onNameChange,
  onSubmit,
}: AdminShippingZoneFormProps) {
  const canCreate = Boolean(name.trim());

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
      <FormSection title={LABELS.addShippingZone} columns={1}>
        <FormFieldFrame label={LABELS.zoneName} htmlFor="shipping-zone-name">
          <Input
            id="shipping-zone-name"
            placeholder={LABELS.zoneName}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </FormFieldFrame>
        <FormError
          error={createError}
          fallback={LABELS.couldNotCreateShippingZone}
        />
        <FormActions>
          <DisabledActionHint
            disabled={!canCreate}
            message={LABELS.enterZoneName}
          >
            <Button type="submit" fullWidth="mobile" disabled={!canCreate}>
              {LABELS.addShippingZone}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormSection>
    </form>
  );
}
