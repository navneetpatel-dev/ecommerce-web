"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterInput } from "../schemas/auth.schema";
import { useRegister } from "../api/auth.queries";
import { useApiFormErrors } from "@/shared/hooks/useApiFormErrors.hook";
import { LABELS } from "@/shared/constants/labels";

export function useRegisterForm() {
  const register = useRegister();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
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
    onSubmit: (data: RegisterInput) => {
      form.clearErrors();
      register.mutate(data);
    },
  };
}
