"use client";

import { useEffect, useState } from "react";
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

/** Create/edit address dialog used by checkout and account addresses. */
export function AddressFormDialog(props: AddressFormDialogProps) {
  const {
    open,
    onOpenChange,
    onSubmit,
    isPending = false,
    address,
    hasAddresses,
    title,
    description,
    submitLabel = LABELS.saveAddress,
  } = props;

  const [form, setForm] = useState<AddressFormValues>(toFormState(address));
  const [formError, setFormError] = useState<string | null>(null);
  const { fieldErrors, clearAll, setErrors, getError } =
    useManualFormFieldErrors<AddressField>();

  useEffect(() => {
    if (open) {
      setForm(toFormState(address));
      setFormError(null);
      clearAll();
    }
  }, [address, open, clearAll]);

  const requiredChecks = addressFieldChecks(form);
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";
  const heading = title ?? (address ? LABELS.editAddress : LABELS.newAddress);

  const setField = <K extends keyof AddressFormValues>(
    field: K,
    value: AddressFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allRequiredFieldsMet(requiredChecks)) {
      setFormError(LABELS.addressRequiredFields);
      return;
    }

    setFormError(null);
    clearAll();

    try {
      await onSubmit(toInput(form, hasAddresses));
      onOpenChange(false);
    } catch (err) {
      const mapped = applyApiErrorsToManualForm<AddressField>(err, setErrors);
      setFormError(
        mapped ? null : getFormLevelApiError(err, LABELS.couldNotSaveAddress),
      );
    }
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>
            {description ?? LABELS.addressFormHint}
          </DialogDescription>
        </DialogHeader>

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

            <FormError
              error={formError}
              fallback={LABELS.couldNotSaveAddress}
            />

            <FormActions>
              <Button type="button" variant="outline" onClick={handleCancel}>
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
      </DialogContent>
    </Dialog>
  );
}
