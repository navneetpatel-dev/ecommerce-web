import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import type { ProductListItem } from "@/shared/api/types";
import { ProductGrid } from "./ProductGrid.component";
import { productRelatedRailsStyles } from "./productRelatedRails.styles";

interface ProductRelatedRailSectionProps {
  eyebrow: string;
  title: string;
  products: ProductListItem[];
  loading: boolean;
  skeletonCount?: number;
}

export function ProductRelatedRailSection({
  eyebrow,
  title,
  products,
  loading,
  skeletonCount = 4,
}: ProductRelatedRailSectionProps) {
  return (
    <section>
      <TextEyebrow className={productRelatedRailsStyles.eyebrow}>
        {eyebrow}
      </TextEyebrow>
      <h2 className={productRelatedRailsStyles.title}>{title}</h2>
      <ProductGrid
        products={products}
        loading={loading}
        skeletonCount={skeletonCount}
      />
    </section>
  );
}
