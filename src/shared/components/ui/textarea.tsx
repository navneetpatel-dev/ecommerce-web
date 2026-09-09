import * as React from "react";
import { cn } from "@/shared/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    const ariaInvalid = error ? true : undefined;

    return (
      <textarea
        className={cn(
          "flex min-h-[132px] w-full rounded-sm border bg-surface-raised px-4 py-3 text-body text-ink placeholder:text-ink-faint outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-line-strong",
          className,
        )}
        ref={ref}
        aria-invalid={ariaInvalid}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
