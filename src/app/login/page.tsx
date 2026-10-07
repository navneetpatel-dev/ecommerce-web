import { Suspense } from "react";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AuthPageSkeleton, LoginForm } from "@/features/auth";

export const metadata = generateNoIndexMetadata("Login");

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
