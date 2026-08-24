import Link from "next/link";
import { AuthFormCard } from "./AuthFormCard.component";
import { FormError } from "@/shared/components/FormError.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useAuthStore } from "@/shared/stores/auth.store";

interface VerifyEmailCardProps {
  token: string;
  isSuccess: boolean;
  error: Error | null;
}

export function VerifyEmailCard({
  token,
  isSuccess,
  error,
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
        {!token ? (
          <p className="rounded-md border border-danger/25 bg-danger-subtle/60 px-4 py-3 text-body text-danger">
            {LABELS.verifyEmailMissingToken}
          </p>
        ) : isSuccess ? (
          <>
            <p className="rounded-md border border-success/25 bg-success-subtle/60 px-4 py-3 text-body text-success">
              {LABELS.verifyEmailSuccess}
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href={continueHref}>{LABELS.continueToAccount}</Link>
            </Button>
          </>
        ) : error ? (
          <FormError error={error} fallback={LABELS.verifyEmailFailed} />
        ) : (
          <p className="text-body text-ink-muted">{LABELS.verifyingEmail}</p>
        )}
      </div>
    </AuthFormCard>
  );
}
