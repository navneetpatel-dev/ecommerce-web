"use client";

import { useState } from "react";
import { deliveryAdminApi } from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

const emptyAgent = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  vehicleType: "BIKE",
  hubOrZone: "",
};

/** Owns the create-delivery-agent form's field state and submit handler. */
export function useCreateDeliveryAgentForm(onCreated: () => void) {
  const [form, setForm] = useState(emptyAgent);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      await deliveryAdminApi.create(form);
      setForm(emptyAgent);
      onCreated();
    } catch (createError) {
      setError(
        getApiErrorMessage(
          createError,
          "Could not create this delivery agent.",
        ),
      );
    } finally {
      setPending(false);
    }
  };

  const canSubmit =
    Boolean(form.email) &&
    form.password.length >= 8 &&
    Boolean(form.fullName) &&
    Boolean(form.phone) &&
    Boolean(form.hubOrZone);

  return { form, setForm, pending, error, submit, canSubmit };
}
