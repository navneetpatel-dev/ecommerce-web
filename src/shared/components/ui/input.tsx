"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const ariaInvalid = error ? true : undefined;

    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-sm border bg-surface-raised px-4 text-body text-ink transition-colors file:border-0 file:bg-transparent file:text-body-sm file:font-medium placeholder:text-ink-faint outline-none focus-visible:border-brand disabled:cursor-not-allowed disabled:opacity-50",
          type === "number" &&
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          (type === "date" || type === "datetime-local" || type === "time") &&
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-2 [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
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
Input.displayName = "Input";

interface PasswordInputProps extends Omit<InputProps, "type"> {
  visible: boolean;
  inputType: string;
  showLabel: string;
  onVisibilityToggle: () => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { className, visible, inputType, showLabel, onVisibilityToggle, ...props },
    ref,
  ) => {
    const visibilityIcon = visible ? (
      <EyeOff size={18} strokeWidth={1.5} aria-hidden />
    ) : (
      <Eye size={18} strokeWidth={1.5} aria-hidden />
    );

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={inputType}
          className={cn("pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={onVisibilityToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-ink-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label={showLabel}
          aria-pressed={visible}
        >
          {visibilityIcon}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { Input, PasswordInput };
export type { PasswordInputProps };
