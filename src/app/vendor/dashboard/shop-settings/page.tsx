import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorShopSettingsPage } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Shop settings");

export default function VendorShopSettingsRoute() {
  return <VendorShopSettingsPage />;
}
