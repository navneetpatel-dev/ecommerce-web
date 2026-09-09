"use client";

import { useVerifyEmailPage } from "../../hooks/verify-email/useVerifyEmailPage.hook";
import { VerifyEmailCard } from "../../components/verify-email/VerifyEmailCard.component";
import { AuthPageShell } from "../../components/shell/AuthPageShell.component";

export function VerifyEmailPage() {
  const page = useVerifyEmailPage();

  return (
    <AuthPageShell>
      <VerifyEmailCard
        status={page.status}
        error={page.error}
        onRetry={page.retry}
      />
    </AuthPageShell>
  );
}
