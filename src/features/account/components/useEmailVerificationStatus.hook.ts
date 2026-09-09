"use client";

import { useResendVerification } from "@/features/auth";
import { LABELS } from "@/shared/constants/labels";

export function useEmailVerificationStatus() {
  const resend = useResendVerification();

  const handleResend = () => {
    resend.mutate();
  };

  const successMessage = resend.data?.alreadyVerified
    ? LABELS.emailAlreadyVerified
    : LABELS.verificationEmailSent;

  return {
    handleResend,
    isPending: resend.isPending,
    isSuccess: resend.isSuccess,
    successMessage,
    error: resend.error as Error | null,
  };
}
