"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { useResendVerification } from "@/features/auth";

interface EmailVerificationStatusProps {
  emailVerified: boolean;
}

export function EmailVerificationStatus({
  emailVerified,
}: EmailVerificationStatusProps) {
  const resend = useResendVerification();

  if (emailVerified) {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 size={12} />
        {LABELS.personalInfoVerified}
      </Badge>
    );
  }

  const message = resend.data?.alreadyVerified
    ? LABELS.emailAlreadyVerified
    : LABELS.verificationEmailSent;

  return (
    <div className="flex flex-col items-start gap-2">
      <Badge variant="outline">{LABELS.personalInfoUnverified}</Badge>
      {resend.isSuccess ? (
        <p className="text-body-sm text-ink-muted">{message}</p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth="mobile"
          loading={resend.isPending}
          onClick={() => resend.mutate()}
        >
          {LABELS.resendVerificationEmail}
        </Button>
      )}
      <FormError
        error={resend.error as Error | null}
        fallback={LABELS.couldNotSendVerificationEmail}
      />
    </div>
  );
}
