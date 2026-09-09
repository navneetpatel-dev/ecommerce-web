import { useCallback, type ChangeEvent } from "react";
import type { CreateDeliveryAgentFormValues } from "../../types/delivery-agents/createDeliveryAgentForm.types";

export function useCreateDeliveryAgentFormFieldsHandlers(
  form: CreateDeliveryAgentFormValues,
  onChange: (next: CreateDeliveryAgentFormValues) => void,
) {
  const handleFullNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...form, fullName: event.target.value });
    },
    [form, onChange],
  );

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...form, email: event.target.value });
    },
    [form, onChange],
  );

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...form, password: event.target.value });
    },
    [form, onChange],
  );

  const handlePhoneChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...form, phone: event.target.value });
    },
    [form, onChange],
  );

  const handleHubOrZoneChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...form, hubOrZone: event.target.value });
    },
    [form, onChange],
  );

  const handleVehicleTypeChange = useCallback(
    (value: string) => {
      onChange({ ...form, vehicleType: value });
    },
    [form, onChange],
  );

  return {
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
    handlePhoneChange,
    handleHubOrZoneChange,
    handleVehicleTypeChange,
  };
}
