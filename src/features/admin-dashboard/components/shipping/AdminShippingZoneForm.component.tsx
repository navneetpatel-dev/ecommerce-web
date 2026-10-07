"use client";

import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";

interface AdminShippingZoneFormProps {
  name: string;
  states: string;
  pincodePrefixes: string;
  createError?: string | null;
  onNameChange: (value: string) => void;
  onStatesChange: (value: string) => void;
  onPincodePrefixesChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export function AdminShippingZoneForm({
  name,
  states,
  pincodePrefixes,
  createError = null,
  onNameChange,
  onStatesChange,
  onPincodePrefixesChange,
  onSubmit,
}: AdminShippingZoneFormProps) {
  const canCreate = Boolean(name.trim());

  const handleSubmit = (event: FormEvent) => {
    if (!canCreate) {
      event.preventDefault();
      return;
    }
    onSubmit(event);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onNameChange(event.target.value);
  };

  const handleStatesChange = (event: ChangeEvent<HTMLInputElement>) => {
    onStatesChange(event.target.value);
  };

  const handlePincodePrefixesChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    onPincodePrefixesChange(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormSection title={LABELS.addShippingZone} columns={1}>
        <FormFieldFrame label={LABELS.zoneName} htmlFor="shipping-zone-name">
          <Input
            id="shipping-zone-name"
            placeholder={LABELS.zoneName}
            value={name}
            onChange={handleNameChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.states}
          htmlFor="shipping-zone-states"
          hint={LABELS.zoneStatesHint}
        >
          <Input
            id="shipping-zone-states"
            placeholder={LABELS.states}
            value={states}
            onChange={handleStatesChange}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.pincodePrefixes}
          htmlFor="shipping-zone-prefixes"
          hint={LABELS.zonePincodePrefixesHint}
        >
          <Input
            id="shipping-zone-prefixes"
            placeholder={LABELS.pincodePrefixes}
            value={pincodePrefixes}
            onChange={handlePincodePrefixesChange}
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
