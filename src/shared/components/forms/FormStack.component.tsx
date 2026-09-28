import type { ReactNode } from "react";
import { cn } from "@/shared/utils/dom/cn";
import { formStackStyles } from "../../styles/forms/forms.styles";

interface FormStackProps {
  children: ReactNode;
  className?: string;
}

/** Vertical rhythm for multi-section dialog/page forms. */
export function FormStack({ children, className }: FormStackProps) {
  return (
    <div className={cn(formStackStyles.container, className)}>{children}</div>
  );
}
