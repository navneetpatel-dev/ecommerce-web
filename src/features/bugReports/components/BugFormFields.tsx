import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame } from "@/shared/components/forms";

interface CharCountedFieldProps {
  id: string;
  label: string;
  htmlForLabel?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** When true renders a textarea with the given rows; otherwise an input. */
  multilineRows?: number;
  maxLength: number;
  error?: string;
  hasError?: boolean;
  counter: React.ReactNode;
}

/** Input/textarea with attached character counter, shared by bug form fields (Rule 2). */
export function CharCountedField(props: CharCountedFieldProps) {
  const {
    id,
    label,
    required,
    value,
    onChange,
    placeholder,
    multilineRows,
    maxLength,
    error,
    hasError,
    counter,
  } = props;

  return (
    <FormFieldFrame
      label={label}
      htmlFor={id}
      required={required}
      error={error}
    >
      {multilineRows ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={multilineRows}
          maxLength={maxLength}
          error={hasError}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          error={hasError}
        />
      )}
      {counter}
    </FormFieldFrame>
  );
}
