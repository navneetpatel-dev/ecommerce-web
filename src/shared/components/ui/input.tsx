"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { inputStyles } from "./input.styles";

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
          inputStyles.base,
          type === "number" && inputStyles.number,
          (type === "date" || type === "datetime-local" || type === "time") &&
            inputStyles.dateTime,
          error ? inputStyles.error : inputStyles.normal,
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
      <div className={inputStyles.passwordWrapper}>
        <Input
          ref={ref}
          type={inputType}
          className={cn(inputStyles.passwordInput, className)}
          {...props}
        />
        <button
          type="button"
          onClick={onVisibilityToggle}
          className={inputStyles.passwordToggle}
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
