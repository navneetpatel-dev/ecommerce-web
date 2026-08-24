import { Suspense } from "react";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AuthPageSkeleton, VerifyEmailPage } from "@/features/auth";

export const metadata = generateNoIndexMetadata("Verify Email");

export default function VerifyEmail() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <VerifyEmailPage />
    </Suspense>
  );
}
