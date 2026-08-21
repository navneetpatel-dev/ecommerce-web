"use client";

import { Button } from "@/shared/components/ui/button";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { FilterSidebar } from "@/features/products/components/FilterSidebar";
import { LABELS } from "@/shared/constants/labels";

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
        className="w-full"
        minPrice={minPrice}
        maxPrice={maxPrice}
        rating={rating}
        onUpdateFilter={onUpdateFilter}
        onClear={onClear}
      />
      <Button className="mt-4 w-full" onClick={onClose}>
        {LABELS.showResults}
      </Button>
    </BottomSheet>
  );
}
