import { Suspense } from "react";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AuthPageSkeleton, RegisterForm } from "@/features/auth";

export const metadata = generateNoIndexMetadata("Register");

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <RegisterForm />
    </Suspense>
  );
}
