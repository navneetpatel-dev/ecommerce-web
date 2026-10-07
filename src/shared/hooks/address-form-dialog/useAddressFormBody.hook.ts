import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useCaptureLocation } from "./useCaptureLocation.hook";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  applyApiErrorsToManualForm,
  getFormLevelApiError,
} from "@/shared/utils/api-errors/applyApiFormErrors";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/validation/firstMissingRequiredHint";
import {
  addressFieldChecks,
  PINCODE_LENGTH,
  toAddressFormState as toFormState,
  toAddressInput as toInput,
  type AddressFormValues,
} from "@/shared/schemas/address.schema";
import type { Address, AddressInput } from "@/shared/api/types";

type AddressField = keyof AddressFormValues;

interface UseAddressFormBodyParams {
  address?: Address | null;
  hasAddresses: boolean;
  onSubmit: (body: AddressInput) => Promise<void>;
  onClose: () => void;
  /** Notifies the host dialog so it can confirm before discarding edits. */
  onDirtyChange?: (dirty: boolean) => void;
}

export function useAddressFormBody({
  address,
  hasAddresses,
  onSubmit,
  onClose,
  onDirtyChange,
}: UseAddressFormBodyParams) {
  const [form, setForm] = useState<AddressFormValues>(toFormState(address));
  const [formError, setFormError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { fieldErrors, clearAll, setErrors, getError } =
    useManualFormFieldErrors<AddressField>();
  const location = useCaptureLocation(
    address?.lat != null && address?.lng != null,
  );
  const requiredChecks = addressFieldChecks(form);
  const canSubmit =
    allRequiredFieldsMet(requiredChecks) && location.status !== "pending";
  const disableHint =
    firstMissingRequiredHint(requiredChecks) ??
    (location.status === "pending" ? LABELS.addressLocationFetching : "");

  useEffect(() => {
    if (location.coords) {
      setForm((current) => ({
        ...current,
        lat: location.coords!.lat,
        lng: location.coords!.lng,
      }));
    }
  }, [location.coords]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const setField = useCallback(
    <K extends keyof AddressFormValues>(
      field: K,
      value: AddressFormValues[K],
    ) => {
      setIsDirty(true);
      setForm((previous) => ({ ...previous, [field]: value }));
    },
    [],
  );

  const updatePincode = (raw: string) =>
    setField("pincode", raw.replace(/\D/g, "").slice(0, PINCODE_LENGTH));

  const handleFieldInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "pincode") updatePincode(value);
    else setField(name as keyof AddressFormValues, value);
  };
  const handleDeliveryInstructionsChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setField("deliveryInstructions", event.target.value);
  };

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
        const mapped = applyApiErrorsToManualForm<AddressField>(
          error,
          setErrors,
        );
        setFormError(
          mapped
            ? null
            : getFormLevelApiError(error, LABELS.couldNotSaveAddress),
        );
      }
    },
    [canSubmit, clearAll, form, hasAddresses, onClose, onSubmit, setErrors],
  );

  return {
    form,
    formError,
    fieldErrors,
    getError,
    location,
    canSubmit,
    disableHint,
    setField,
    handleFieldInputChange,
    handleDeliveryInstructionsChange,
    handleSubmit,
  };
}
