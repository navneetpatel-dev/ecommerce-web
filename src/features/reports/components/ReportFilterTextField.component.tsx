import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";

interface ReportFilterTextFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  disabled: boolean;
  disabledHint: string;
  onChange: (value: string) => void;
}

/** A single text-input report filter (vendor/category/status), wrapped in its disabled-reason hint. */
export function ReportFilterTextField({
  id,
  label,
  value,
  placeholder,
  disabled,
  disabledHint,
  onChange,
}: ReportFilterTextFieldProps) {
  return (
    <FormFieldFrame label={label} htmlFor={id}>
      <DisabledActionHint disabled={disabled} message={disabledHint} block>
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </DisabledActionHint>
    </FormFieldFrame>
  );
}
