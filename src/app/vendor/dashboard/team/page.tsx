import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorTeamPage } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Team Management");

export default function VendorTeamRoute() {
  return <VendorTeamPage />;
}
