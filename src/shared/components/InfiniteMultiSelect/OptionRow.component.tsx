"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
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
      className="flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 hover:bg-surface"
    >
      <Checkbox
        id={inputId}
        checked={checked}
        disabled={disabled}
        onCheckedChange={() => onToggle(option.id)}
        className="mt-0.5"
      />
      <span className="text-[0.875rem] leading-snug text-ink">
        {option.label}
      </span>
    </label>
  );
}
