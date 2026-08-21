import { ProductGrid } from "./ProductGrid";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { LABELS } from "@/shared/constants/labels";
import type { ProductListItem } from "@/shared/api/types";

interface RecentlyViewedSectionProps {
  products: ProductListItem[];
}

export function RecentlyViewedSection({
  products,
}: RecentlyViewedSectionProps) {
  if (!products.length) return null;

  return (
    <section>
      <TextEyebrow className="mb-2">{LABELS.homeYourBrowsing}</TextEyebrow>
      <h2 className="text-[1.375rem] font-semibold text-ink mb-6">
        {LABELS.homeRecentlyViewed}
      </h2>
      <ProductGrid products={products} skeletonCount={8} />
    </section>
  );
}
