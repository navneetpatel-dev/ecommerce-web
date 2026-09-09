"use client";

import { Button } from "@/shared/components/ui/button";
import { BottomSheet } from "@/shared/components/BottomSheet.component";
import { FilterSidebar } from "@/features/products/components/FilterSidebar.component";
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
}

export function FiltersBottomSheet({
  open,
  onClose,
  minPrice,
  maxPrice,
  rating,
  onUpdateFilter,
  onClear,
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
