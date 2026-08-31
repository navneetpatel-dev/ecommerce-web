import { Package, SlidersHorizontal } from "lucide-react";
import { SortBar, ProductGrid } from "@/features/products";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import type { ProductFilters, ProductListResponse } from "@/features/products";
import type { ProductListItem } from "@/shared/api/types";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";

interface ProductResultsProps {
  filters: ProductFilters;
  data?: ProductListResponse;
  isFetching: boolean;
  compareMode: boolean;
  comparedIds: string[];
  compareAtLimit: boolean;
  onToggleCompare: (product: ProductListItem) => void;
  onToggleCompareMode: () => void;
  onUpdateFilter: (key: string, value: unknown) => void;
  hasActiveFacets: boolean;
  categoryName: string;
  onClearFilters: () => void;
  parentCategoryLabel: string;
  slugPath: string[];
}

export function ProductResults({
  filters,
  data,
  isFetching,
  compareMode,
  comparedIds,
  compareAtLimit,
  onToggleCompare,
  onToggleCompareMode,
  onUpdateFilter,
  hasActiveFacets,
  categoryName,
  onClearFilters,
  parentCategoryLabel,
  slugPath,
}: ProductResultsProps) {
  const emptyIcon = hasActiveFacets ? SlidersHorizontal : Package;

  return (
    <div className="min-w-0 flex-1">
      <SortBar
        sort={filters.sort}
        totalProducts={data?.total}
        isFetching={isFetching}
        onSortChange={(v) => onUpdateFilter("sort", v)}
        compareMode={compareMode}
        onToggleCompare={onToggleCompareMode}
        hideSortOnMobile
        className="mb-4 border-b-0 pb-0 xl:mb-6 xl:border-b xl:pb-4"
      />

      {!data && isFetching ? (
        <ProductGrid loading skeletonCount={12} />
      ) : data?.items.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          eyebrow={
            hasActiveFacets
              ? LABELS.categoryPlpNoFilterMatchesEyebrow
              : LABELS.categoryPlpEmptyEyebrow
          }
          heading={formatLabel(
            hasActiveFacets
              ? LABELS.categoryPlpNoFilterMatchesHeading
              : LABELS.categoryPlpEmptyHeading,
            { name: categoryName },
          )}
          message={
            hasActiveFacets
              ? LABELS.categoryPlpNoFilterMatchesBody
              : LABELS.categoryPlpEmptyBody
          }
          actionLabel={
            hasActiveFacets ? LABELS.clearFacetFilters : LABELS.allCategories
          }
          actionTo={hasActiveFacets ? undefined : PATHS.categories}
          onAction={hasActiveFacets ? onClearFilters : undefined}
          secondaryAction={
            hasActiveFacets
              ? {
                  label: LABELS.allProducts,
                  href: PATHS.products,
                  variant: "secondary",
                }
              : slugPath.length > 1
                ? {
                    label: formatLabel(LABELS.browseParentCategory, {
                      name: parentCategoryLabel,
                    }),
                    href: PATHS.category(...slugPath.slice(0, -1)),
                    variant: "secondary",
                  }
                : {
                    label: LABELS.allProducts,
                    href: PATHS.products,
                    variant: "secondary",
                  }
          }
          className="py-14 md:py-16"
        />
      ) : (
        <>
          <ProductGrid
            products={data?.items}
            compareMode={compareMode}
            comparedIds={comparedIds}
            compareAtLimit={compareAtLimit}
            onToggleCompare={onToggleCompare}
          />
          {data && data.totalPages > 1 ? (
            <PaginationContainer
              currentPage={filters.page ?? 1}
              totalPages={data.totalPages}
              onPageChange={(p) => onUpdateFilter("page", p)}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
