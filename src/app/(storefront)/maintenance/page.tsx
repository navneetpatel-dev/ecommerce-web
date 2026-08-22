import { MaintenancePage } from "@/features/content";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.maintenanceHeading);

export default function Maintenance() {
  return <MaintenancePage />;
}
