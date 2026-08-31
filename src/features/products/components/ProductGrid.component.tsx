import { Package } from "lucide-react";
import type { ProductListItem } from "@/shared/api/types";
import { ProductCardContainer } from "../containers/ProductCardContainer.container";
import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { EmptyState } from "@/shared/components/EmptyState.component";

interface ProductGridProps {
  products?: ProductListItem[];
  loading?: boolean;
  skeletonCount?: number;
  emptyHeading?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  emptyActionTo?: string;
  compareMode?: boolean;
  comparedIds?: string[];
  compareAtLimit?: boolean;
  onToggleCompare?: (product: ProductListItem) => void;
}

export function ProductGrid({
  products,
  loading,
  skeletonCount = 12,
  emptyHeading = "No products found",
  emptyMessage = "No products match these filters.",
  emptyActionLabel = "Clear all filters",
  emptyActionTo,
  compareMode = false,
  comparedIds = [],
  compareAtLimit = false,
  onToggleCompare,
}: ProductGridProps) {
  if (loading) return <SkeletonGrid count={skeletonCount} />;

  if (!products?.length) {
    return (
      <EmptyState
        heading={emptyHeading}
        message={emptyMessage}
        icon={Package}
        actionLabel={emptyActionLabel}
        actionTo={emptyActionTo}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 pb-4">
      {products.map((product) => (
        <ProductCardContainer
          key={product.id}
          product={product}
          compareMode={compareMode}
          isCompared={comparedIds.includes(product.id)}
          compareAtLimit={compareAtLimit}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
