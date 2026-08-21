import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { PlatformSettingsPage } from "@/features/admin-dashboard";

export const metadata = generateNoIndexMetadata("Settings");

export default function AdminSettings() {
  return <PlatformSettingsPage />;
}
