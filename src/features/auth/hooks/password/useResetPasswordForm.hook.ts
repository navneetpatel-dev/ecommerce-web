"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "../../schemas/auth/auth.schema";
import { useResetPassword } from "../../api/auth/auth.queries";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { LABELS } from "@/shared/constants/labels";

export function useResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const resetPassword = useResetPassword();
  const form = useForm<ResetPasswordInput>({
    mode: "onTouched",
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token },
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

  // The token is a hidden field, so an error on it would show nowhere: say the
  // link is the problem instead, and offer a new one.
  const linkInvalid = Boolean(form.formState.errors.token);

  return {
    form,
    hasToken: Boolean(token),
    linkInvalid,
    error: linkInvalid ? LABELS.resetLinkInvalid : formLevelError,
    isPending: resetPassword.isPending,
    onSubmit,
  };
}
