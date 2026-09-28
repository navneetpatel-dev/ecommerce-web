import { HistoryPage } from "@/features/delivery-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.history);

export default function History() {
  return <HistoryPage />;
}
