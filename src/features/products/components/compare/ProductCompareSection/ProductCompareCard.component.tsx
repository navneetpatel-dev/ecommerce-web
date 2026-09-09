import type { ProductListItem } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { productCompareSectionStyles } from "../../../styles/compare/productCompareSection.styles";

interface ProductCompareCardProps {
  product: ProductListItem;
}

export function ProductCompareCard({ product }: ProductCompareCardProps) {
  const stockText =
    product.stock > 0 ? `${product.stock} available` : LABELS.outOfStock;

  const vendorName = product.vendor?.businessName ?? "Marketplace vendor";

  return (
    <article className={productCompareSectionStyles.card}>
      <h3 className={productCompareSectionStyles.cardTitle}>{product.name}</h3>
      <dl className={productCompareSectionStyles.dl}>
        <div>
          <dt className={productCompareSectionStyles.dt}>Price</dt>
          <dd className={productCompareSectionStyles.priceDd}>
            ₹{formatInrAmount(product.basePrice)}
          </dd>
        </div>
        <div>
          <dt className={productCompareSectionStyles.dt}>Rating</dt>
          <dd className={productCompareSectionStyles.dd}>
            {product.avgRating.toFixed(1)} / 5
          </dd>
        </div>
        <div>
          <dt className={productCompareSectionStyles.dt}>Reviews</dt>
          <dd className={productCompareSectionStyles.dd}>
            {product.reviewCount}
          </dd>
        </div>
        <div>
          <dt className={productCompareSectionStyles.dt}>Stock</dt>
          <dd className={productCompareSectionStyles.dd}>{stockText}</dd>
        </div>
        <div>
          <dt className={productCompareSectionStyles.dt}>Vendor</dt>
          <dd className={productCompareSectionStyles.dd}>{vendorName}</dd>
        </div>
      </dl>
    </article>
  );
}
