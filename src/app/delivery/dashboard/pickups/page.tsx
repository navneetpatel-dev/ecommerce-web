import { PickupsPage } from "@/features/delivery-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.pickups);

export default function Pickups() {
  return <PickupsPage />;
}
