import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorRegisterPage } from "@/features/vendors";

export const metadata = generateNoIndexMetadata("Vendor Registration");

export default function VendorRegister() {
  return <VendorRegisterPage />;
}
