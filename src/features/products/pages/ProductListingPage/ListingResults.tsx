"use client";

import type { ProductListItem } from "@/shared/api/types";
import { SortBar } from "@/features/products/components/SortBar";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { PaginationContainer } from "@/shared/containers/PaginationContainer";
import { EmptyState } from "@/shared/components/EmptyState";
import type { ListingEmptyState } from "./emptyState";

interface ListingResultsProps {
  sort?: string;
  totalProducts?: number;
  isFetching: boolean;
  onSortChange: (value: string) => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  isLoading: boolean;
  isEmpty: boolean;
  empty: ListingEmptyState;
  products?: ProductListItem[];
  comparedIds: ProductListItem["id"][];
  onToggleCompareProduct: (product: ProductListItem) => void;
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function ListingResults({
  sort,
  totalProducts,
  isFetching,
  onSortChange,
  compareMode,
  onToggleCompare,
  isLoading,
  isEmpty,
  empty,
  products,
  comparedIds,
  onToggleCompareProduct,
  currentPage,
  totalPages,
  onPageChange,
  onClearFilters,
}: ListingResultsProps) {
  return (
    <>
      <SortBar
        sort={sort}
        totalProducts={totalProducts}
        isFetching={isFetching}
        onSortChange={onSortChange}
        compareMode={compareMode}
        onToggleCompare={onToggleCompare}
      />

      {isLoading ? (
        <ProductGrid loading skeletonCount={12} />
      ) : isEmpty ? (
        <EmptyState
          icon={empty.icon}
          eyebrow={empty.eyebrow}
          heading={empty.heading}
          message={empty.message}
          actionLabel={empty.actionLabel}
          actionTo={empty.actionTo}
          onAction={
            empty.onAction === "clearFilters" ? onClearFilters : undefined
          }
        />
      ) : (
        <>
          <ProductGrid
            products={products}
            compareMode={compareMode}
            comparedIds={comparedIds}
            onToggleCompare={onToggleCompareProduct}
          />
          {(totalPages ?? 0) > 1 && (
            <PaginationContainer
              currentPage={currentPage}
              totalPages={totalPages ?? 0}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </>
  );
}
