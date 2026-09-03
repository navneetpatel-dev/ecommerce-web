"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { useResendVerificationByEmail } from "../api/auth.queries";

interface ResendVerificationByEmailProps {
  email: string;
}

/** Shown when login is blocked because the account isn't verified yet — the
 * person has no session, so this hits the unauthenticated resend endpoint. */
export function ResendVerificationByEmail({
  email,
}: ResendVerificationByEmailProps) {
  const resend = useResendVerificationByEmail();

  const message = resend.data?.alreadyVerified
    ? LABELS.emailAlreadyVerified
    : LABELS.verificationEmailSent;

  return (
    <div className="flex flex-col items-start gap-2">
      {resend.isSuccess ? (
        <p className="text-body-sm text-ink-muted">{message}</p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth="mobile"
          loading={resend.isPending}
          onClick={() => resend.mutate(email)}
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
