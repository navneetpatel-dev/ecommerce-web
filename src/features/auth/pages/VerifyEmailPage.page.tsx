"use client";

import { useVerifyEmailPage } from "../hooks/useVerifyEmailPage.hook";
import { VerifyEmailCard } from "../components/VerifyEmailCard.component";
import { AuthPageShell } from "../components/AuthPageShell.component";

export function VerifyEmailPage() {
  const page = useVerifyEmailPage();

  return (
    <AuthPageShell>
      <VerifyEmailCard
        token={page.token}
        isSuccess={page.isSuccess}
        error={page.error}
      />
    </AuthPageShell>
  );
}
