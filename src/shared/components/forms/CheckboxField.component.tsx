import type { ReactNode } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/utils/dom/cn";

interface CheckboxFieldProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

/** Labeled checkbox row using shared `Checkbox` — use for lists and form toggles. */
export function CheckboxField({
  id,
  checked,
  onCheckedChange,
  label,
  disabled,
  className,
  labelClassName,
}: CheckboxFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-2 text-[0.875rem] text-ink",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span className={cn("min-w-0 flex-1", labelClassName)}>{label}</span>
    </label>
  );
}
