import { LABELS } from "@/shared/constants/labels";
import type { UgcLimit } from "@/shared/constants/ugc/ugcLimits";
import { cn } from "@/shared/utils/dom/cn";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { characterCountStyles as styles } from "../../styles/display/displayComponents.styles";

interface CharacterCountProps {
  /** Referenced by the field's `aria-describedby`. */
  id: string;
  value: string;
  limits: UgcLimit;
}

/** "8 more characters needed · 42 / 300" under a text field; warns near the cap. */
export function CharacterCount({ id, value, limits }: CharacterCountProps) {
  const length = value.trim().length;
  const missing = Math.max(0, limits.min - length);
  const near = length >= limits.max * 0.9;

  return (
    <div id={id} className={styles.root}>
      {missing > 0 && length > 0 ? (
        <span className={styles.hint}>
          {formatLabel(LABELS.ugcMoreNeeded, { count: missing })}
        </span>
      ) : null}
      <span
        className={cn(
          styles.count,
          near && styles.countNear,
          length >= limits.max && styles.countFull,
        )}
        aria-label={formatLabel(LABELS.ugcCountLabel, {
          count: length,
          max: limits.max,
        })}
      >
        {formatLabel(LABELS.ugcCount, { count: length, max: limits.max })}
      </span>
    </div>
  );
}
