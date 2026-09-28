import * as React from "react";
import { cn } from "@/shared/utils/dom/cn";
import { textareaStyles } from "@/shared/styles/ui/textarea.styles";
import {
  joinAriaIds,
  useFieldControl,
} from "@/shared/components/forms/fieldControl.context";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const field = useFieldControl();
    const ariaInvalid =
      props["aria-invalid"] ?? (error || field?.invalid ? true : undefined);

    return (
      <textarea
        className={cn(
          textareaStyles.base,
          error ? textareaStyles.error : textareaStyles.normal,
          className,
        )}
        ref={ref}
        {...props}
        id={props.id ?? field?.controlId}
        aria-invalid={ariaInvalid}
        aria-describedby={joinAriaIds(
          props["aria-describedby"],
          field?.describedById,
        )}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
