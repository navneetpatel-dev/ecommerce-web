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
  labelAction?: ReactNode;
  footerAction?: ReactNode;
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
  labelAction,
  footerAction,
}: FormFieldFrameProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {labelAction ? (
        <div className="flex items-center justify-between">
          <Label htmlFor={htmlFor}>
            {label}
            {required ? <RequiredMark /> : null}
          </Label>
          {labelAction}
        </div>
      ) : (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <RequiredMark /> : null}
        </Label>
      )}
      {children}
      {footerAction ? (
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          {error ? (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          ) : hint ? (
            <p className="text-body-sm text-ink-muted">{hint}</p>
          ) : (
            <span />
          )}
          <div className="ml-auto">{footerAction}</div>
        </div>
      ) : (
        <>
          {error ? (
            <p role="alert" className="text-body-sm text-danger">
              {error}
            </p>
          ) : null}
          {hint ? <p className="text-body-sm text-ink-muted">{hint}</p> : null}
        </>
      )}
    </div>
  );
}
