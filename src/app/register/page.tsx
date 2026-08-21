import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { RegisterForm } from "@/features/auth";

export const metadata = generateNoIndexMetadata("Register");

export default function RegisterPage() {
  return <RegisterForm />;
}
