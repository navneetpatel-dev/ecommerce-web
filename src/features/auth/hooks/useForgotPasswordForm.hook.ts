"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/auth.schema";
import { useForgotPassword } from "../api/auth.queries";

export function useForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) =>
    forgotPassword.mutate(data.email);

  return {
    form,
    isPending: forgotPassword.isPending,
    isSuccess: forgotPassword.isSuccess,
    onSubmit,
  };
}
