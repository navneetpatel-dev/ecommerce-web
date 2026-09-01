import type { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/cn";

interface FormFieldFrameProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

function RequiredMark() {
  return (
    <span className="text-danger" aria-hidden>
      {" "}
      *
    </span>
  );
}

/**
 * Label + control slot + optional required mark, error, and hint.
 * Replaces duplicated Field / RequiredMark / FieldError helpers across forms.
 */
export function FormFieldFrame({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldFrameProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <RequiredMark /> : null}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p className="text-body-sm text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}
