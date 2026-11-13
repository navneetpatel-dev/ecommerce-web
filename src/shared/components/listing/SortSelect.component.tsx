"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { FilterChipOption } from "./FilterChipGroup.component";
import { sortSelectStyles as styles } from "../../styles/listing/filterChips.styles";

interface SortSelectProps<T extends string> {
  options: readonly FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

function SortSelectItems<T extends string>({
  options,
}: {
  options: readonly FilterChipOption<T>[];
}) {
  return (
    <>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </>
  );
}

/** Labelled "Sort by" dropdown for list pages. */
export function SortSelect<T extends string>({
  options,
  value,
  onChange,
}: SortSelectProps<T>) {
  const labelId = useId();
  const handleChange = (next: string) => onChange(next as T);

  return (
    <div className={styles.root}>
      <span id={labelId} className={styles.label}>
        {LABELS.sortBy}
      </span>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger aria-labelledby={labelId} className={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SortSelectItems options={options} />
        </SelectContent>
      </Select>
    </div>
  );
}
