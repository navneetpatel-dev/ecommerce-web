import { useId, type ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/utils/dom/cn";
import { FieldControlProvider, joinAriaIds } from "./fieldControl.context";
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
  // React's useId contains ":" / "«»" — legal in ids, awkward in selectors and
  // e2e locators — strip them so the id stays copy-pasteable and CSS-safe.
  const generatedId = `field-${useId().replace(/[:«»]/g, "")}`;
  const controlId = htmlFor ?? generatedId;
  const errorId = error ? `${controlId}-error` : undefined;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const describedById = joinAriaIds(errorId, hintId);

  const labelNode = (
    <Label htmlFor={controlId}>
      {label}
      {required ? <RequiredMark /> : null}
    </Label>
  );

  const errorNode = error ? (
    <p id={errorId} role="alert" className={formFieldFrameStyles.error}>
      {error}
    </p>
  ) : null;

  const hintNode = hint ? (
    <p id={hintId} className={formFieldFrameStyles.hint}>
      {hint}
    </p>
  ) : null;

  return (
    <div className={cn(formFieldFrameStyles.container, className)}>
      {labelAction ? (
        <div className={formFieldFrameStyles.labelRow}>
          {labelNode}
          {labelAction}
        </div>
      ) : (
        labelNode
      )}
      {/* Publishes the control id + description ids so Input/Select/Textarea
          inside the frame wire themselves (aria-describedby / aria-invalid). */}
      <FieldControlProvider
        value={{ controlId, describedById, invalid: Boolean(error) }}
      >
        {children}
      </FieldControlProvider>
      {footerAction ? (
        <div className={formFieldFrameStyles.footerRow}>
          {errorNode ?? (hint ? hintNode : <span />)}
          <div className={formFieldFrameStyles.footerActionWrapper}>
            {footerAction}
          </div>
        </div>
      ) : (
        <>
          {errorNode}
          {hintNode}
        </>
      )}
    </div>
  );
}
