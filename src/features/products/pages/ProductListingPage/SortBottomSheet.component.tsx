"use client";

import { BottomSheet } from "@/shared/components/BottomSheet.component";
import { SelectableOptionButton } from "@/shared/components/SelectableOptionButton.component";
import { SORT_OPTIONS } from "../../hooks/useProductListing.hook";
import { LABELS } from "@/shared/constants/labels";

interface SortBottomSheetProps {
  open: boolean;
  onClose: () => void;
  sort?: string;
  onSelectSort: (value: string) => void;
}

export function SortBottomSheet({
  open,
  onClose,
  sort,
  onSelectSort,
}: SortBottomSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={LABELS.sort}>
      <div className="space-y-2">
        {SORT_OPTIONS.map((option) => (
          <SelectableOptionButton
            key={option.value}
            selected={sort === option.value}
            onClick={() => onSelectSort(option.value)}
          >
            {option.label}
          </SelectableOptionButton>
        ))}
      </div>
    </BottomSheet>
  );
}
