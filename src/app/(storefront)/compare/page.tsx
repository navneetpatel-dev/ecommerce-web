import { ComparePage } from "@/features/products";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { LABELS } from "@/shared/constants/labels";

export const metadata = generateNoIndexMetadata(LABELS.comparePageTitle);

export default function Compare() {
  return <ComparePage />;
}
