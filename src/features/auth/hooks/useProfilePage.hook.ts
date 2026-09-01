"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChangePasswordSchema,
  type ChangePasswordInput,
} from "../schemas/auth.schema";
import { useChangePassword } from "../api/auth.queries";
import { useApiFormErrors } from "@/shared/hooks/useApiFormErrors.hook";
import { LABELS } from "@/shared/constants/labels";

export function useProfilePage() {
  const changePassword = useChangePassword();
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { formLevelError } = useApiFormErrors(
    form,
    changePassword.error,
    LABELS.couldNotChangePassword,
    { currentPassword: "currentPassword" },
  );

  return {
    form,
    error: formLevelError,
    isPending: changePassword.isPending,
    isSuccess: changePassword.isSuccess,
    onSubmit: (data: ChangePasswordInput) => {
      form.clearErrors();
      changePassword.mutate(data);
    },
    resetSuccess: () => {
      changePassword.reset();
      form.reset();
    },
  };
}
