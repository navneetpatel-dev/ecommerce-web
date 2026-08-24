import { BottomSheet } from "@/shared/components/BottomSheet.component";
import { SelectableOptionButton } from "@/shared/components/SelectableOptionButton.component";
import { LABELS } from "@/shared/constants/labels";

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
  return (
    <BottomSheet open={open} onClose={onClose} title={LABELS.sort}>
      <div className="space-y-2">
        {sortOptions.map((option) => (
          <SelectableOptionButton
            key={option.value}
            selected={currentSort === option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </SelectableOptionButton>
        ))}
      </div>
    </BottomSheet>
  );
}
