"use client";

import { forwardRef } from "react";
import type { ProductListItem } from "@/shared/api/types";
import { productCompareSectionStyles } from "./productCompareSection.styles";
import { ProductCompareGrid } from "./ProductCompareGrid.component";

export interface ProductCompareSectionProps {
  products: ProductListItem[];
}

export const ProductCompareSection = forwardRef<
  HTMLElement,
  ProductCompareSectionProps
>(function ProductCompareSection({ products }, ref) {
  if (products.length < 2) return null;

  return (
    <section ref={ref} className={productCompareSectionStyles.root}>
      <div className={productCompareSectionStyles.header}>
        <h2 className={productCompareSectionStyles.title}>
          Product comparison
        </h2>
        <p className={productCompareSectionStyles.subtitle}>
          Review price, rating, stock, and vendor details side by side.
        </p>
      </div>
      <ProductCompareGrid products={products} />
    </section>
  );
});
