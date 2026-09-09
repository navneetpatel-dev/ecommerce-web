import { ProductGrid } from "../listing/ProductGrid.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { ProductListItem } from "@/shared/api/types";
import { productDetailsMiscStyles } from "../detail/productDetailsMisc.styles";

interface RecentlyViewedSectionProps {
  products: ProductListItem[];
}

export function RecentlyViewedSection({
  products,
}: RecentlyViewedSectionProps) {
  if (!products.length) return null;

  return (
    <section>
      <TextEyebrow className={productDetailsMiscStyles.recentEyebrow}>
        {LABELS.homeYourBrowsing}
      </TextEyebrow>
      <h2 className={productDetailsMiscStyles.recentTitle}>
        {LABELS.homeRecentlyViewed}
      </h2>
      <ProductGrid products={products} skeletonCount={8} />
    </section>
  );
}
