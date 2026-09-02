"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormError } from "@/shared/components/FormError.component";
import { FormActions, FormStack } from "@/shared/components/forms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/applyApiFormErrors";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";
import {
  addressFieldChecks,
  toAddressFormState as toFormState,
  toAddressInput as toInput,
  type AddressFormValues,
} from "@/shared/schemas/address.schema";
import type { Address, AddressInput } from "@/shared/api/types";
import { AddressFormFields } from "./AddressFormDialog/AddressFormFields.component";

type AddressField = keyof AddressFormValues;

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: AddressInput) => Promise<void>;
  isPending?: boolean;
  address?: Address | null;
  hasAddresses: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

interface AddressFormBodyProps {
  address?: Address | null;
  hasAddresses: boolean;
  isPending: boolean;
  submitLabel: string;
  onSubmit: (body: AddressInput) => Promise<void>;
  onClose: () => void;
}

function AddressFormBody({
  address,
  hasAddresses,
  isPending,
  submitLabel,
  onSubmit,
  onClose,
}: AddressFormBodyProps) {
  const [form, setForm] = useState<AddressFormValues>(toFormState(address));
  const [formError, setFormError] = useState<string | null>(null);
  const { fieldErrors, clearAll, setErrors, getError } =
    useManualFormFieldErrors<AddressField>();
  const requiredChecks = addressFieldChecks(form);
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";

  const setField = <K extends keyof AddressFormValues>(
    field: K,
    value: AddressFormValues[K],
  ) => setForm((previous) => ({ ...previous, [field]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      setFormError(LABELS.addressRequiredFields);
      return;
    }

    setFormError(null);
    clearAll();
    try {
      await onSubmit(toInput(form, hasAddresses));
      onClose();
    } catch (error) {
      const mapped = applyApiErrorsToManualForm<AddressField>(error, setErrors);
      setFormError(
        mapped ? null : getFormLevelApiError(error, LABELS.couldNotSaveAddress),
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormStack>
        <AddressFormFields
          form={form}
          setField={setField}
          hasAddresses={hasAddresses}
          isEditing={Boolean(address)}
          fieldErrors={fieldErrors}
          getError={getError}
        />
        <FormError error={formError} fallback={LABELS.couldNotSaveAddress} />
        <FormActions>
          <Button type="button" variant="outline" onClick={onClose}>
            {LABELS.cancel}
          </Button>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              loading={isPending}
              disabled={!canSubmit || isPending}
            >
              {submitLabel}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}

/** Create/edit address dialog used by checkout and account addresses. */
export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  address,
  hasAddresses,
  title,
  description,
  submitLabel = LABELS.saveAddress,
}: AddressFormDialogProps) {
  const heading = title ?? (address ? LABELS.editAddress : LABELS.newAddress);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            {description ?? LABELS.addressFormHint}
          </DialogDescription>
        </DialogHeader>
        <AddressFormBody
          key={`${open ? "open" : "closed"}:${address?.id ?? "new"}`}
          address={address}
          hasAddresses={hasAddresses}
          isPending={isPending}
          submitLabel={submitLabel}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
