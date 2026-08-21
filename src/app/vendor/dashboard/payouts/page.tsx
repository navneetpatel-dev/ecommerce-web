import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { PayoutsPage } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Payouts");

export default function VendorPayouts() {
  return <PayoutsPage />;
}
