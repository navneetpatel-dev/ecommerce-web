import type { ReactNode } from "react";
import { cn } from "@/shared/utils/dom/cn";
import { filterChipStyles as styles } from "../../styles/listing/filterChips.styles";

interface FilterChipProps {
  pressed: boolean;
  onPress: () => void;
  children: ReactNode;
}

/** One toggle in a filter group — `aria-pressed`, never a radio (see AGENTS §11). */
export function FilterChip({ pressed, onPress, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onPress}
      className={cn(styles.chip, pressed ? styles.chipActive : styles.chipIdle)}
    >
      {children}
    </button>
  );
}
