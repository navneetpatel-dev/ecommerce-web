import type { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/dom/cn";
import { formFieldFrameStyles } from "../../styles/forms/forms.styles";

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
    <span className={formFieldFrameStyles.requiredMark} aria-hidden>
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
    <div className={cn(formFieldFrameStyles.container, className)}>
      {labelAction ? (
        <div className={formFieldFrameStyles.labelRow}>
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
        <div className={formFieldFrameStyles.footerRow}>
          {error ? (
            <p role="alert" className={formFieldFrameStyles.error}>
              {error}
            </p>
          ) : hint ? (
            <p className={formFieldFrameStyles.hint}>{hint}</p>
          ) : (
            <span />
          )}
          <div className={formFieldFrameStyles.footerActionWrapper}>
            {footerAction}
          </div>
        </div>
      ) : (
        <>
          {error ? (
            <p role="alert" className={formFieldFrameStyles.error}>
              {error}
            </p>
          ) : null}
          {hint ? <p className={formFieldFrameStyles.hint}>{hint}</p> : null}
        </>
      )}
    </div>
  );
}
