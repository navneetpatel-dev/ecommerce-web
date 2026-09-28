import { DeliveryProfilePage } from "@/features/delivery-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.profile);

export default function Profile() {
  return <DeliveryProfilePage />;
}
