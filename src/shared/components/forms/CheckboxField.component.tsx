import type { ReactNode } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/utils/dom/cn";
import { useFieldControl } from "./fieldControl.context";
import { checkboxFieldStyles } from "../../styles/forms/forms.styles";

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
  const fieldControl = useFieldControl();

  const handleCheckedChange = (value: boolean | "indeterminate") =>
    onCheckedChange(value === true);

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
        aria-invalid={fieldControl?.invalid ? true : undefined}
        aria-describedby={fieldControl?.describedById}
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
      />
      <span className={cn(checkboxFieldStyles.labelText, labelClassName)}>
        {label}
      </span>
    </label>
  );
}
