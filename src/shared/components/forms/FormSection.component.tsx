import type { ReactNode } from "react";
import { cn } from "@/shared/utils/dom/cn";
import { formSectionStyles } from "./forms.styles";

interface FormSectionProps {
  title: string;
  hint?: string;
  children: ReactNode;
  /** Grid columns from `sm` breakpoint. Defaults to 2. Pass 1 for stacked, 3 for wide settings pages. */
  columns?: 1 | 2 | 3;
  className?: string;
  contentClassName?: string;
}

/**
 * Bordered settings-style section with optional hint and responsive field grid.
 */
export function FormSection({
  title,
  hint,
  children,
  columns = 2,
  className,
  contentClassName,
}: FormSectionProps) {
  return (
    <section className={cn(formSectionStyles.section, className)}>
      <header className={formSectionStyles.header}>
        <h3 className={formSectionStyles.title}>{title}</h3>
        {hint ? <p className={formSectionStyles.hint}>{hint}</p> : null}
      </header>
      <div
        className={cn(
          formSectionStyles.content,
          columns === 3 && formSectionStyles.col3,
          columns === 2 && formSectionStyles.col2,
          columns === 1 && formSectionStyles.col1,
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
