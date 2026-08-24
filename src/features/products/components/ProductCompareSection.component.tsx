"use client";

import { forwardRef } from "react";
import type { ProductListItem } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface ProductCompareSectionProps {
  products: ProductListItem[];
}

export const ProductCompareSection = forwardRef<
  HTMLElement,
  ProductCompareSectionProps
>(function ProductCompareSection({ products }, ref) {
  if (products.length < 2) return null;

  return (
    <section
      ref={ref}
      className="mt-12 rounded-lg border border-line bg-surface p-6"
    >
      <div className="mb-6">
        <h2 className="text-[1.375rem] font-semibold text-ink">
          Product comparison
        </h2>
        <p className="mt-1 text-body text-ink-muted">
          Review price, rating, stock, and vendor details side by side.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-md border border-line bg-paper p-4"
          >
            <h3 className="text-[1rem] font-medium text-ink">{product.name}</h3>
            <dl className="mt-4 space-y-3 text-body">
              <div>
                <dt className="text-ink-muted">Price</dt>
                <dd className="font-medium text-brand">
                  ₹{formatInrAmount(product.basePrice)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Rating</dt>
                <dd className="text-ink">{product.avgRating.toFixed(1)} / 5</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Reviews</dt>
                <dd className="text-ink">{product.reviewCount}</dd>
              </div>
              <div>
                <dt className="text-ink-muted">Stock</dt>
                <dd className="text-ink">
                  {product.stock > 0
                    ? `${product.stock} available`
                    : LABELS.outOfStock}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted">Vendor</dt>
                <dd className="text-ink">
                  {product.vendor?.businessName ?? "Marketplace vendor"}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
});
