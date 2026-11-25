"use client";

import { useCallback } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { infiniteSingleSelectStyles } from "../../styles/infinite-single-select/infiniteSingleSelect.styles";

export function OptionRow({
  optionId,
  selected,
  label,
  sublabel,
  disabled,
  onSelect,
}: {
  optionId: string;
  selected: boolean;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
}) {
  const handleSelect = useCallback(() => {
    onSelect(optionId);
  }, [onSelect, optionId]);

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      disabled={disabled}
      onClick={handleSelect}
      className={cn(
        infiniteSingleSelectStyles.optionRow.base,
        selected && infiniteSingleSelectStyles.optionRow.selected,
      )}
    >
      <span className={infiniteSingleSelectStyles.optionRow.labelWrapper}>
        <span className={infiniteSingleSelectStyles.optionRow.label}>
          {label}
        </span>
        {sublabel ? (
          <span className={infiniteSingleSelectStyles.optionRow.sublabel}>
            {sublabel}
          </span>
        ) : null}
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
