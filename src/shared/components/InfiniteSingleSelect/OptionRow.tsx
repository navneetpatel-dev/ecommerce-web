"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

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
        "relative flex h-10 w-full cursor-pointer select-none items-center rounded-sm px-4 pr-10 text-left text-[0.9375rem] outline-none hover:bg-brand-subtle focus-visible:bg-brand-subtle disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        selected && "bg-brand-subtle/60",
      )}
    >
      <span className="line-clamp-1 min-w-0 flex-1 text-ink">{label}</span>
      {selected ? (
        <span className="absolute right-2 flex items-center justify-center">
          <Check size={16} className="text-brand" />
        </span>
      ) : null}
    </button>
  );
}
