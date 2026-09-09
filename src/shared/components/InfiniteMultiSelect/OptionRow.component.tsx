"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { infiniteMultiSelectStyles } from "./infiniteMultiSelect.styles";
import type { InfiniteMultiSelectOption } from "./types";

interface OptionRowProps {
  option: InfiniteMultiSelectOption;
  checked: boolean;
  disabled: boolean;
  inputId: string;
  onToggle: (id: string) => void;
}

export function OptionRow({
  option,
  checked,
  disabled,
  inputId,
  onToggle,
}: OptionRowProps) {
  return (
    <label
      htmlFor={inputId}
      className={infiniteMultiSelectStyles.optionRow.label}
    >
      <Checkbox
        id={inputId}
        checked={checked}
        disabled={disabled}
        onCheckedChange={() => onToggle(option.id)}
        className={infiniteMultiSelectStyles.optionRow.checkbox}
      />
      <span className={infiniteMultiSelectStyles.optionRow.text}>
        {option.label}
      </span>
    </label>
  );
}
