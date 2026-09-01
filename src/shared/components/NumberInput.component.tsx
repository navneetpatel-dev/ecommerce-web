"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";

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

function parseValue(raw: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function clamp(n: number, min?: number, max?: number) {
  let next = n;
  if (min != null && next < min) next = min;
  if (max != null && next > max) next = max;
  return next;
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
          Number(
            raw +
              "9".repeat(Math.max(0, minDigits - raw.length)),
          ) >= min;
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
          "flex h-11 w-full items-stretch overflow-hidden rounded-sm border bg-surface-raised transition-colors",
          "focus-within:border-brand",
          error ? "border-danger" : "border-line-strong",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {prefix ? (
          <span className="flex shrink-0 items-center border-r border-line-strong bg-paper/60 px-3 text-body-sm font-medium text-ink-muted">
            {prefix}
          </span>
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
          className={cn(
            "min-w-0 flex-1 bg-transparent px-4 text-body tabular-nums text-ink outline-none",
            "placeholder:text-ink-faint",
            "[appearance:textfield]",
          )}
          onFocus={beginDraft}
          onChange={handleInput}
          onBlur={endDraft}
          onKeyDown={handleKeyDown}
        />

        {suffix ? (
          <span className="flex shrink-0 items-center px-3 text-body-sm font-medium text-ink-muted">
            {suffix}
          </span>
        ) : null}

        {showSteppers ? (
          <div className="flex w-9 shrink-0 flex-col border-l border-line-strong">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled || atMax}
              aria-label={LABELS.increaseValue}
              className={cn(
                "flex flex-1 items-center justify-center text-ink-muted transition-colors",
                "hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-40",
              )}
              onClick={() => bump(1)}
            >
              <ChevronUp size={14} strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled || atMin}
              aria-label={LABELS.decreaseValue}
              className={cn(
                "flex flex-1 items-center justify-center border-t border-line-strong text-ink-muted transition-colors",
                "hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-40",
              )}
              onClick={() => bump(-1)}
            >
              <ChevronDown size={14} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";
