import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { CheckoutPage } from "@/features/checkout";

export const metadata = generateNoIndexMetadata("Checkout");

export default function Checkout() {
  return <CheckoutPage />;
}
