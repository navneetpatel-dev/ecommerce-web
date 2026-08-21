"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { CheckboxField } from "@/shared/components/CheckboxField";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { PINCODE_LENGTH, PINCODE_PATTERN } from "@/shared/constants/pincode";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";
import type { Address, AddressInput } from "@/shared/api/types";

type AddressFormState = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
};

function toFormState(address?: Address | null): AddressFormState {
  return {
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    country: address?.country ?? LABELS.defaultCountry,
    pincode: address?.pincode ?? "",
    isDefault: address?.isDefault ?? false,
  };
}

function toInput(form: AddressFormState, hasAddresses: boolean): AddressInput {
  return {
    line1: form.line1.trim(),
    line2: form.line2.trim() || null,
    city: form.city.trim(),
    state: form.state.trim(),
    country: form.country.trim() || LABELS.defaultCountry,
    pincode: form.pincode.trim(),
    isDefault: form.isDefault || !hasAddresses,
  };
}

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
  const [form, setForm] = useState<AddressFormState>(toFormState(address));
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(toFormState(address));
      setFormError(null);
    }
  }, [address, open]);

  const requiredChecks = [
    { ok: Boolean(form.line1.trim()), message: LABELS.enterAddressLine1 },
    { ok: Boolean(form.city.trim()), message: LABELS.enterAddressCity },
    { ok: Boolean(form.state.trim()), message: LABELS.enterAddressState },
    {
      ok: PINCODE_PATTERN.test(form.pincode.trim()),
      message: LABELS.invalidPincode,
    },
  ];
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {title ?? (address ? LABELS.editAddress : LABELS.newAddress)}
          </DialogTitle>
          <DialogDescription>
            {description ?? LABELS.addressFormHint}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (
              !form.line1.trim() ||
              !form.city.trim() ||
              !form.state.trim() ||
              !PINCODE_PATTERN.test(form.pincode.trim())
            ) {
              setFormError(LABELS.addressRequiredFields);
              return;
            }

            setFormError(null);

            try {
              await onSubmit(toInput(form, hasAddresses));
              onOpenChange(false);
            } catch (err) {
              setFormError(getApiErrorMessage(err, LABELS.couldNotSaveAddress));
            }
          }}
        >
          <FormStack>
            <FormSection
              title={LABELS.addressFormSection}
              hint={LABELS.addressFormSectionHint}
            >
              <FormFieldFrame
                label={LABELS.addressLine1}
                htmlFor="shared-addr-line1"
                required
                className="sm:col-span-2"
              >
                <Input
                  id="shared-addr-line1"
                  value={form.line1}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, line1: e.target.value }))
                  }
                  placeholder={LABELS.addressLine1Placeholder}
                  required
                />
              </FormFieldFrame>

              <FormFieldFrame
                label={LABELS.addressLine2Optional}
                htmlFor="shared-addr-line2"
                className="sm:col-span-2"
              >
                <Input
                  id="shared-addr-line2"
                  value={form.line2}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, line2: e.target.value }))
                  }
                  placeholder={LABELS.addressLine2Placeholder}
                />
              </FormFieldFrame>

              <FormFieldFrame
                label={LABELS.addressCity}
                htmlFor="shared-addr-city"
                required
              >
                <Input
                  id="shared-addr-city"
                  value={form.city}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, city: e.target.value }))
                  }
                  required
                />
              </FormFieldFrame>

              <FormFieldFrame
                label={LABELS.addressState}
                htmlFor="shared-addr-state"
                required
              >
                <Input
                  id="shared-addr-state"
                  value={form.state}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, state: e.target.value }))
                  }
                  required
                />
              </FormFieldFrame>

              <FormFieldFrame
                label={LABELS.addressPincode}
                htmlFor="shared-addr-pincode"
                required
              >
                <Input
                  id="shared-addr-pincode"
                  inputMode="numeric"
                  maxLength={PINCODE_LENGTH}
                  value={form.pincode}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      pincode: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, PINCODE_LENGTH),
                    }))
                  }
                  required
                />
              </FormFieldFrame>

              <FormFieldFrame
                label={LABELS.addressCountry}
                htmlFor="shared-addr-country"
              >
                <Input
                  id="shared-addr-country"
                  value={form.country}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, country: e.target.value }))
                  }
                />
              </FormFieldFrame>

              {hasAddresses || address ? (
                <CheckboxField
                  id="shared-addr-default"
                  className="sm:col-span-2"
                  checked={form.isDefault}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isDefault: checked }))
                  }
                  label={LABELS.addressSetDefault}
                />
              ) : null}
            </FormSection>

            {formError ? (
              <p role="alert" className="text-[0.875rem] text-danger">
                {formError}
              </p>
            ) : null}

            <FormActions>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
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
