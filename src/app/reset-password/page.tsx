import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { ResetPasswordPage } from "@/features/auth";

export const metadata = generateNoIndexMetadata("Reset Password");

export default function ResetPassword() {
  return <ResetPasswordPage />;
}
