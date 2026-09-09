"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { useEmailVerificationStatus } from "../../hooks/personal-info/useEmailVerificationStatus.hook";
import { emailVerificationStatusStyles as styles } from "../../styles/personal-info/emailVerificationStatus.styles";

interface EmailVerificationStatusProps {
  emailVerified: boolean;
}

export function EmailVerificationStatus({
  emailVerified,
}: EmailVerificationStatusProps) {
  const { handleResend, isPending, isSuccess, successMessage, error } =
    useEmailVerificationStatus();

  if (emailVerified) {
    return (
      <Badge variant="success" className={styles.verifiedBadge}>
        <CheckCircle2 size={12} />
        {LABELS.personalInfoVerified}
      </Badge>
    );
  }

  return (
    <div className={styles.container}>
      <Badge variant="outline">{LABELS.personalInfoUnverified}</Badge>
      {isSuccess ? (
        <p className={styles.successMessage}>{successMessage}</p>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth="mobile"
          loading={isPending}
          onClick={handleResend}
        >
          {LABELS.resendVerificationEmail}
        </Button>
      )}
      <FormError
        error={error}
        fallback={LABELS.couldNotSendVerificationEmail}
      />
    </div>
  );
}
