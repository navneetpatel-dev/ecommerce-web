import Link from "next/link";
import { AuthFormCard } from "./AuthFormCard.component";
import { FormError } from "@/shared/components/FormError.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useAuthStore } from "@/shared/stores/auth.store";
import type { VerifyEmailStatus } from "../hooks/useVerifyEmailPage.hook";

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
        <Link
          href={PATHS.login}
          className="block text-center text-body font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
        >
          {LABELS.backToLogin}
        </Link>
      }
    >
      <div className="space-y-5">
        {status === "missing-token" && (
          <p className="rounded-md border border-danger/25 bg-danger-subtle/60 px-4 py-3 text-body text-danger">
            {LABELS.verifyEmailMissingToken}
          </p>
        )}

        {status === "verifying" && (
          <p className="text-body text-ink-muted">{LABELS.verifyingEmail}</p>
        )}

        {status === "timeout" && (
          <>
            <FormError
              error={LABELS.verifyEmailTimeout}
              fallback={LABELS.verifyEmailTimeout}
            />
            <Button
              type="button"
              className="w-full"
              size="lg"
              onClick={onRetry}
            >
              {LABELS.tryAgain}
            </Button>
          </>
        )}

        {status === "success" && (
          <>
            <p className="rounded-md border border-success/25 bg-success-subtle/60 px-4 py-3 text-body text-success">
              {LABELS.verifyEmailSuccess}
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href={continueHref}>{LABELS.continueToAccount}</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <FormError error={error} fallback={LABELS.verifyEmailFailed} />
            <Button
              type="button"
              className="w-full"
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
