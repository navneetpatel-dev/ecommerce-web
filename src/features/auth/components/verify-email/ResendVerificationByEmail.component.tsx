"use client";

import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { useResendVerificationByEmail } from "../../api/auth/auth.queries";
import { authFormsStyles } from "../../styles/shell/authForms.styles";

interface ResendVerificationByEmailProps {
  email: string;
}

/** Shown when login is blocked because the account isn't verified yet — the
 * person has no session, so this hits the unauthenticated resend endpoint. */
export function ResendVerificationByEmail({
  email,
}: ResendVerificationByEmailProps) {
  const resend = useResendVerificationByEmail();

  const handleResend = () => resend.mutate(email);

  const message = resend.data?.alreadyVerified
    ? LABELS.emailAlreadyVerified
    : LABELS.verificationEmailSent;

  return (
    <div className={authFormsStyles.resendWrapper}>
      {resend.isSuccess ? (
        <p role="status" className={authFormsStyles.mutedBodySm}>
          {message}
        </p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth="mobile"
          loading={resend.isPending}
          onClick={handleResend}
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
