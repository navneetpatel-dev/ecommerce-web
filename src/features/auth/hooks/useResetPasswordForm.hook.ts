"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/auth.schema";
import { useResetPassword } from "../api/auth.queries";
import { useApiFormErrors } from "@/shared/hooks/useApiFormErrors.hook";
import { LABELS } from "@/shared/constants/labels";

export function useResetPasswordForm() {
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token: searchParams.get("token") || "" },
  });

  const { formLevelError } = useApiFormErrors(
    form,
    resetPassword.error,
    LABELS.resetPasswordFailed,
    { token: "token" },
  );

  const onSubmit = (data: ResetPasswordInput) => {
    form.clearErrors();
    resetPassword.mutate(data);
  };

  return {
    form,
    error: formLevelError,
    isPending: resetPassword.isPending,
    onSubmit,
  };
}
