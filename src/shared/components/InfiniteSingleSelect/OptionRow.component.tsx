"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { infiniteSingleSelectStyles } from "../../styles/infinite-single-select/infiniteSingleSelect.styles";

export function OptionRow({
  selected,
  label,
  disabled,
  onSelect,
}: {
  selected: boolean;
  label: string;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        infiniteSingleSelectStyles.optionRow.base,
        selected && infiniteSingleSelectStyles.optionRow.selected,
      )}
    >
      <span className={infiniteSingleSelectStyles.optionRow.label}>
        {label}
      </span>
      {selected ? (
        <span className={infiniteSingleSelectStyles.optionRow.checkWrapper}>
          <Check
            size={16}
            className={infiniteSingleSelectStyles.optionRow.checkIcon}
          />
        </span>
      ) : null}
    </button>
  );
}
