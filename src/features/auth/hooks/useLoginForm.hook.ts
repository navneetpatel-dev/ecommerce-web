"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { LoginSchema, type LoginInput } from "../schemas/auth.schema";
import { useLogin } from "../api/auth.queries";
import { useApiFormErrors } from "@/shared/hooks/useApiFormErrors.hook";
import { LABELS } from "@/shared/constants/labels";

export function useLoginForm() {
  const login = useLogin();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const oauthError = searchParams.get("oauthError");
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const { formLevelError } = useApiFormErrors(
    form,
    login.error,
    LABELS.loginFailed,
  );

  const error = useMemo(
    () => formLevelError ?? oauthError,
    [formLevelError, oauthError],
  );

  const onSubmit = (data: LoginInput) => {
    form.clearErrors();
    login.mutate({ ...data, redirect });
  };

  return {
    form,
    error,
    redirect,
    isPending: login.isPending,
    onSubmit,
  };
}
