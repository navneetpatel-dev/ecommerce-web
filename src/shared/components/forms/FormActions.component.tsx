import type { ReactNode } from "react";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { cn } from "@/shared/utils/cn";
import { formActionsStyles } from "./forms.styles";

interface FormActionsProps {
  children: ReactNode;
  /** Optional status / helper text on the leading side. */
  leading?: ReactNode;
  className?: string;
}

/** Footer action row for forms and dialogs — stacks on mobile, row on `sm+`. */
export function FormActions({
  children,
  leading,
  className,
}: FormActionsProps) {
  return (
    <div className={cn(formActionsStyles.container, className)}>
      {leading != null ? (
        <div className={formActionsStyles.leading} aria-live="polite">
          {leading}
        </div>
      ) : (
        <span className={formActionsStyles.spacer} />
      )}
      <ButtonGroup align="end">{children}</ButtonGroup>
    </div>
  );
}
