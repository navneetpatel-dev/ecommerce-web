import { TodayPage } from "@/features/delivery-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.today);

export default function Today() {
  return <TodayPage />;
}
