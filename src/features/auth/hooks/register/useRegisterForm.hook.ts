"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  type RegisterInput,
} from "../../schemas/auth/auth.schema";
import { useRegister } from "../../api/auth/auth.queries";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { normalisePhoneNumber } from "@/shared/utils/validation/phoneNumber";
import { LABELS } from "@/shared/constants/labels";

export function useRegisterForm() {
  const register = useRegister();
  const form = useForm<RegisterInput>({
    mode: "onTouched",
    resolver: zodResolver(RegisterSchema),
    defaultValues: { phone: "" },
  });

  const { formLevelError } = useApiFormErrors(
    form,
    register.error,
    LABELS.registrationFailed,
  );

  return {
    form,
    error: formLevelError,
    isPending: register.isPending,
    isSuccess: register.isSuccess,
    registeredEmail: register.data?.user.email ?? null,
    onSubmit: (data: RegisterInput) => {
      form.clearErrors();
      register.mutate({
        ...data,
        // Registered phone is stored as digits, matching the profile form.
        phone: data.phone?.trim()
          ? normalisePhoneNumber(data.phone)
          : undefined,
      });
    },
  };
}
