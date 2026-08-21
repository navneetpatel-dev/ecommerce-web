import { Button } from "@/shared/components/ui/button";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { FilterSidebar } from "@/features/products";
import type { ProductFilters } from "@/features/products";
import type { CategoryFacet } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: ProductFilters;
  facets: CategoryFacet[];
  facetSelections: Record<string, string[]>;
  onToggleFacet: (filterKey: string, value: string) => void;
  onUpdateFilter: (key: string, value: unknown) => void;
  onClear: () => void;
}

export function FilterSheet({
  open,
  onClose,
  filters,
  facets,
  facetSelections,
  onToggleFacet,
  onUpdateFilter,
  onClear,
}: FilterSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={LABELS.filters}>
      <FilterSidebar
        idPrefix="cat-mobile"
        className="w-full"
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        rating={filters.rating}
        facets={facets}
        facetSelections={facetSelections}
        onToggleFacet={onToggleFacet}
        onUpdateFilter={onUpdateFilter}
        onClear={() => {
          onClear();
          onClose();
        }}
      />
      <Button className="mt-4 w-full" onClick={onClose}>
        {LABELS.showResults}
      </Button>
    </BottomSheet>
  );
}
