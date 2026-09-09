"use client";

import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { NumberInputSteppers } from "./NumberInputSteppers.component";
import { clamp, parseValue } from "@/shared/utils/numberInputMath";

import { numberInputStyles } from "./numberInput.styles";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "size"
> {
  value: number | string | null | undefined;
  onChange: (value: number | undefined) => void;
  /** Shown before the value (e.g. ₹). */
  prefix?: string;
  /** Shown after the value (e.g. %). */
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  /** Soft up/down steppers (default true). */
  showSteppers?: boolean;
  error?: boolean;
}

/**
 * Classy number field: no native spinners, optional prefix/suffix,
 * vertical steppers + ArrowUp/ArrowDown keyboard support.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      prefix,
      suffix,
      min,
      max,
      step = 1,
      showSteppers = true,
      error,
      disabled,
      id,
      onBlur,
      onFocus,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const [draft, setDraft] = React.useState<string | null>(null);

    const committed =
      value === null ||
      value === undefined ||
      (typeof value === "number" && Number.isNaN(value))
        ? ""
        : String(value);

    const display = draft ?? committed;
    const numeric = parseValue(display);
    const atMin = min != null && numeric != null && numeric <= min;
    const atMax = max != null && numeric != null && numeric >= max;

    const beginDraft = (e: React.FocusEvent<HTMLInputElement>) => {
      setDraft(committed);
      onFocus?.(e);
    };
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;

      if (raw.trim() === "") {
        setDraft(null);
        onChange(undefined);
        return;
      }

      const parsed = parseValue(raw);
      if (parsed === undefined) {
        setDraft(raw);
        return;
      }

      if (max != null && parsed > max) {
        setDraft(null);
        onChange(max);
        return;
      }

      if (min != null && parsed < min) {
        const minDigits = String(Math.floor(min)).length;
        const couldReachMin =
          /^\d+$/.test(raw) &&
          Number(raw + "9".repeat(Math.max(0, minDigits - raw.length))) >= min;
        if (!couldReachMin) {
          setDraft(null);
          onChange(min);
          return;
        }
      }

      setDraft(raw);
      onChange(parsed);
    };

    const endDraft = (e: React.FocusEvent<HTMLInputElement>) => {
      commitDraft(draft ?? display);
      onBlur?.(e);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        bump(1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        bump(-1);
      }
      onKeyDown?.(e);
    };

    const bump = (dir: 1 | -1) => {
      if (disabled) return;
      if (dir === 1 && atMax) return;
      if (dir === -1 && atMin) return;
      const base = numeric ?? (dir === 1 ? (min ?? 0) : (max ?? 0));
      const next = clamp(Number((base + dir * step).toFixed(6)), min, max);
      setDraft(null);
      onChange(next);
    };

    const commitDraft = (raw: string) => {
      setDraft(null);
      const parsed = parseValue(raw);
      if (parsed === undefined) {
        onChange(undefined);
        return;
      }
      onChange(clamp(parsed, min, max));
    };

    return (
      <div
        className={cn(
          numberInputStyles.container,
          error
            ? numberInputStyles.borderError
            : numberInputStyles.borderDefault,
          disabled && numberInputStyles.disabled,
          className,
        )}
      >
        {prefix ? (
          <span className={numberInputStyles.prefix}>{prefix}</span>
        ) : null}

        <input
          {...props}
          ref={ref}
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={display}
          aria-invalid={error ? true : undefined}
          className={numberInputStyles.input}
          onFocus={beginDraft}
          onChange={handleInput}
          onBlur={endDraft}
          onKeyDown={handleKeyDown}
        />

        {suffix ? (
          <span className={numberInputStyles.suffix}>{suffix}</span>
        ) : null}

        {showSteppers ? (
          <NumberInputSteppers
            disabled={disabled}
            atMin={atMin}
            atMax={atMax}
            onBump={bump}
          />
        ) : null}
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";
