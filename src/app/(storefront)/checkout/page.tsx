import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { CheckoutPage } from "@/features/checkout";
import { AuthGate } from "@/shared/components/system/AuthGate.component";

export const metadata = generateNoIndexMetadata("Checkout");

export default function Checkout() {
  return (
    <AuthGate>
      <CheckoutPage />
    </AuthGate>
  );
}
