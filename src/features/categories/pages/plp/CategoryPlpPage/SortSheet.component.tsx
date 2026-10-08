import { BottomSheet } from "@/shared/containers/dialogs";
import { SelectableOptionButton } from "@/shared/components/forms/SelectableOptionButton.component";
import { LABELS } from "@/shared/constants/labels";
import { categoryPlpPageStyles as styles } from "./categoryPlpPage.styles";

interface SortSheetProps {
  open: boolean;
  onClose: () => void;
  sortOptions: ReadonlyArray<{ value: string; label: string }>;
  currentSort?: string;
  onSelect: (value: string) => void;
}

export function SortSheet({
  open,
  onClose,
  sortOptions,
  currentSort,
  onSelect,
}: SortSheetProps) {
  const selectSort = (value: string) => () => onSelect(value);

  return (
    <BottomSheet open={open} onClose={onClose} title={LABELS.sort}>
      <div className={styles.optionsContainer}>
        {sortOptions.map((option) => (
          <SelectableOptionButton
            key={option.value}
            selected={currentSort === option.value}
            onClick={selectSort(option.value)}
          >
            {option.label}
          </SelectableOptionButton>
        ))}
      </div>
    </BottomSheet>
  );
}
