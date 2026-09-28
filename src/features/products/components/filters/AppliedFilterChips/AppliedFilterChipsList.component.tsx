import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { AppliedFilterChip as AppliedFilterChipModel } from "../../../types/filters/appliedFilterChip.types";
import { AppliedFilterChip } from "./AppliedFilterChip.component";

/** Owns the collection rendering — parent JSX stays free of `.map()`. */
export function AppliedFilterChipsList({
  chips,
}: {
  chips: AppliedFilterChipModel[];
}) {
  return (
    <>
      {chips.map((chip) => (
        <AppliedFilterChip
          key={chip.id}
          label={chip.label}
          onRemove={chip.onRemove}
          removeAriaLabel={formatLabel(LABELS.removeFilter, {
            filter: chip.label,
          })}
        />
      ))}
    </>
  );
}
