"use client";

import { FilterChip } from "./FilterChip.component";
import { filterChipStyles as styles } from "../../styles/listing/filterChips.styles";

export interface FilterChipOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipGroupProps<T extends string> {
  label: string;
  options: readonly FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A single-choice row of toggle chips (`role="group"` + `aria-pressed`). */
export function FilterChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterChipGroupProps<T>) {
  const select = (next: T) => () => onChange(next);

  return (
    <div role="group" aria-label={label} className={styles.group}>
      {options.map((option) => (
        <FilterChip
          key={option.value}
          pressed={option.value === value}
          onPress={select(option.value)}
        >
          {option.label}
        </FilterChip>
      ))}
    </div>
  );
}
