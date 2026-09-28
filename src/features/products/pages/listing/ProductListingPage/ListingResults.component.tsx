"use client";

import type { ProductListItem } from "@/shared/api/types";
import { SortBar } from "@/features/products/components/sort/SortBar.component";
import { ProductGrid } from "@/features/products/components/listing/ProductGrid.component";
import { AppliedFilterChips } from "@/features/products/components/filters/AppliedFilterChips";
import { SearchDidYouMean } from "@/features/search";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import type { AppliedFilterChip } from "@/features/products/components/filters/AppliedFilterChips";
import type { ListingEmptyState } from "./emptyState";

interface ListingResultsProps {
  sort?: string;
  totalProducts?: number;
  /** Removable applied-filter chips (empty array hides the row). */
  chips: AppliedFilterChip[];
  /** Suggestion line shown above the empty state when a close match exists. */
  didYouMean?: { term: string; href: string };
  isFetching: boolean;
  onSortChange: (value: string) => void;
  sortDisabled?: boolean;
  compareMode: boolean;
  onToggleCompare: () => void;
  isLoading: boolean;
  isEmpty: boolean;
  empty: ListingEmptyState;
  products?: ProductListItem[];
  comparedIds: ProductListItem["id"][];
  compareAtLimit?: boolean;
  onToggleCompareProduct: (product: ProductListItem) => void;
  currentPage: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function ListingResults({
  sort,
  totalProducts,
  chips,
  didYouMean,
  isFetching,
  onSortChange,
  sortDisabled = false,
  compareMode,
  onToggleCompare,
  isLoading,
  isEmpty,
  empty,
  products,
  comparedIds,
  compareAtLimit = false,
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
        disabled={sortDisabled}
        compareMode={compareMode}
        onToggleCompare={onToggleCompare}
      />

      <AppliedFilterChips chips={chips} />

      {isLoading ? (
        <ProductGrid loading skeletonCount={12} />
      ) : isEmpty ? (
        <>
          {didYouMean ? (
            <SearchDidYouMean term={didYouMean.term} href={didYouMean.href} />
          ) : null}
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
        </>
      ) : (
        <>
          <ProductGrid
            products={products}
            compareMode={compareMode}
            comparedIds={comparedIds}
            compareAtLimit={compareAtLimit}
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
