import * as React from "react";
import { cn } from "@/shared/utils/dom/cn";
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
          "flex min-h-[132px] w-full rounded-sm border bg-surface-raised px-4 py-3 text-body text-ink placeholder:text-ink-faint outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-line-strong",
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
