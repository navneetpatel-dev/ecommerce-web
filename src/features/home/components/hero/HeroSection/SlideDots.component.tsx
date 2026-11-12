"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import { heroSectionStyles as styles } from "../../../styles/hero/heroSection.styles";

interface SlideDotsProps {
  count: number;
  index: number;
  onSelect: (index: number) => void;
}

/** How many slides there are and which one is showing; each dot opens its slide (B-22). */
export function SlideDots({ count, index, onSelect }: SlideDotsProps) {
  return (
    <div role="group" aria-label={LABELS.chooseSlide} className={styles.dots}>
      {Array.from({ length: count }, (_, dot) => (
        <SlideDot
          key={dot}
          dot={dot}
          count={count}
          current={dot === index}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function SlideDot({
  dot,
  count,
  current,
  onSelect,
}: {
  dot: number;
  count: number;
  current: boolean;
  onSelect: (index: number) => void;
}) {
  const handleClick = () => onSelect(dot);
  return (
    <button
      type="button"
      aria-label={formatLabel(LABELS.slideOfTotal, {
        index: dot + 1,
        total: count,
      })}
      aria-current={current ? "true" : undefined}
      onClick={handleClick}
      className={styles.dotButton}
    >
      <span
        aria-hidden
        className={cn(styles.dot, current && styles.dotActive)}
      />
    </button>
  );
}
