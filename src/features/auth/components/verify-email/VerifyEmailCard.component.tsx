import Link from "next/link";
import { AuthFormCard } from "../shell/AuthFormCard.component";
import { FormError } from "@/shared/components/FormError.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import type { VerifyEmailStatus } from "../../hooks/verify-email/useVerifyEmailPage.hook";
import { authFormsStyles } from "../../styles/shell/authForms.styles";

interface VerifyEmailCardProps {
  status: VerifyEmailStatus;
  error: Error | null;
  onRetry: () => void;
}

export function VerifyEmailCard({
  status,
  error,
  onRetry,
}: VerifyEmailCardProps) {
  const isAuthenticated = Boolean(useAuthStore((s) => s.accessToken));
  const continueHref = isAuthenticated ? PATHS.profile : PATHS.login;

  return (
    <AuthFormCard
      title={LABELS.verifyEmailTitle}
      description={LABELS.verifyEmailHint}
      footer={
        <Link href={PATHS.login} className={authFormsStyles.footerLink}>
          {LABELS.backToLogin}
        </Link>
      }
    >
      <div className={authFormsStyles.formSpace5}>
        {status === "missing-token" && (
          <p className={authFormsStyles.dangerBanner}>
            {LABELS.verifyEmailMissingToken}
          </p>
        )}

        {status === "verifying" && (
          <p className={authFormsStyles.mutedBody}>{LABELS.verifyingEmail}</p>
        )}

        {status === "timeout" && (
          <>
            <FormError
              error={LABELS.verifyEmailTimeout}
              fallback={LABELS.verifyEmailTimeout}
            />
            <Button
              type="button"
              className={authFormsStyles.fullWidth}
              size="lg"
              onClick={onRetry}
            >
              {LABELS.tryAgain}
            </Button>
          </>
        )}

        {status === "success" && (
          <>
            <p className={authFormsStyles.successBanner}>
              {LABELS.verifyEmailSuccess}
            </p>
            <Button asChild className={authFormsStyles.fullWidth} size="lg">
              <Link href={continueHref}>{LABELS.continueToAccount}</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <FormError error={error} fallback={LABELS.verifyEmailFailed} />
            <Button
              type="button"
              className={authFormsStyles.fullWidth}
              size="lg"
              onClick={onRetry}
            >
              {LABELS.tryAgain}
            </Button>
          </>
        )}
      </div>
    </AuthFormCard>
  );
}
