import { Suspense } from "react";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AuthPageSkeleton, ForgotPasswordPage } from "@/features/auth";

export const metadata = generateNoIndexMetadata("Forgot Password");

export default function ForgotPassword() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
