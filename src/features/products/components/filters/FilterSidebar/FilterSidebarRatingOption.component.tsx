import { RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { filterSidebarStyles } from "../../../styles/filters/filterSidebar.styles";

interface FilterSidebarRatingOptionProps {
  rating: number;
  idPrefix: string;
}

export function FilterSidebarRatingOption({
  rating,
  idPrefix,
}: FilterSidebarRatingOptionProps) {
  const id = `${idPrefix}-rating-${rating}`;

  return (
    <div className={filterSidebarStyles.ratingOptionRow}>
      <RadioGroupItem value={String(rating)} id={id} />
      <Label htmlFor={id} className={filterSidebarStyles.ratingLabel}>
        {formatLabel(LABELS.starsAndUp, { count: rating })}
      </Label>
    </div>
  );
}
