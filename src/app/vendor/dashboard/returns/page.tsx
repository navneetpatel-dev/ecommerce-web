import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorReturnsPage } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Returns");

export default function VendorReturns() {
  return <VendorReturnsPage />;
}
