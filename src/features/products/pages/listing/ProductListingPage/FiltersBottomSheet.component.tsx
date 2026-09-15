"use client";

import { Button } from "@/shared/components/ui/button";
import { BottomSheet } from "@/shared/components/BottomSheet.component";
import { FilterSidebar } from "@/features/products/components/filters/FilterSidebar.component";
import { LABELS } from "@/shared/constants/labels";
import { productListingPageStyles } from "./productListingPage.styles";

interface FiltersBottomSheetProps {
  open: boolean;
  onClose: () => void;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  onUpdateFilter: (key: string, value: unknown) => void;
  onClear: () => void;
  hideRatingFilter?: boolean;
}

export function FiltersBottomSheet({
  open,
  onClose,
  minPrice,
  maxPrice,
  rating,
  onUpdateFilter,
  onClear,
  hideRatingFilter = false,
}: FiltersBottomSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={LABELS.filters}>
      <FilterSidebar
        idPrefix="mobile"
        className={productListingPageStyles.filterSidebarFull}
        minPrice={minPrice}
        maxPrice={maxPrice}
        rating={rating}
        onUpdateFilter={onUpdateFilter}
        onClear={onClear}
        hideRatingFilter={hideRatingFilter}
      />
      <Button
        className={productListingPageStyles.filterSubmitButton}
        onClick={onClose}
      >
        {LABELS.showResults}
      </Button>
    </BottomSheet>
  );
}
