import { LABELS } from "@/shared/constants/labels";
import type { AppliedFilterChip as AppliedFilterChipModel } from "../../../types/filters/appliedFilterChip.types";
import { appliedFilterChipsStyles } from "../../../styles/filters/appliedFilterChips.styles";
import { AppliedFilterChipsList } from "./AppliedFilterChipsList.component";

/** Applied facet chips above the PLP grid — hides itself when nothing is set. */
export function AppliedFilterChips({
  chips,
}: {
  chips: AppliedFilterChipModel[];
}) {
  if (chips.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={LABELS.appliedFiltersLabel}
      className={appliedFilterChipsStyles.row}
    >
      <AppliedFilterChipsList chips={chips} />
    </div>
  );
}
