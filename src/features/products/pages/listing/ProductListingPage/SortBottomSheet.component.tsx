"use client";

import { BottomSheet } from "@/shared/containers/dialogs";
import { SelectableOptionButton } from "@/shared/components/forms/SelectableOptionButton.component";
import { SORT_OPTIONS } from "../../../hooks/listing/useProductListing.hook";
import { LABELS } from "@/shared/constants/labels";
import { productListingPageStyles } from "./productListingPage.styles";

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
  const selectSort = (value: string) => () => onSelectSort(value);

  return (
    <BottomSheet open={open} onClose={onClose} title={LABELS.sort}>
      <div className={productListingPageStyles.sortOptionsList}>
        {SORT_OPTIONS.map((option) => (
          <SelectableOptionButton
            key={option.value}
            selected={sort === option.value}
            onClick={selectSort(option.value)}
          >
            {option.label}
          </SelectableOptionButton>
        ))}
      </div>
    </BottomSheet>
  );
}
