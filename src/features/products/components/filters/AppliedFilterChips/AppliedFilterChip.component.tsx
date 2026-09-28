import { X } from "lucide-react";
import { appliedFilterChipsStyles } from "../../../styles/filters/appliedFilterChips.styles";

interface AppliedFilterChipProps {
  label: string;
  /** Pre-formatted "Remove {filter} filter" copy, built by the list. */
  removeAriaLabel: string;
  onRemove: () => void;
}

/** One removable applied-filter chip (design spec §4.2). */
export function AppliedFilterChip({
  label,
  removeAriaLabel,
  onRemove,
}: AppliedFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={removeAriaLabel}
      className={appliedFilterChipsStyles.chip}
    >
      <span>{label}</span>
      <X className={appliedFilterChipsStyles.chipIcon} aria-hidden />
    </button>
  );
}
