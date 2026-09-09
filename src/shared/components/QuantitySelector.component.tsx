"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { AnimatedQuantityValue } from "@/shared/components/AnimatedQuantityValue.component";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  disabledHint?: string;
  className?: string;
  /** Overrides minus / value / plus cell size. */
  controlClassName?: string;
  valueClassName?: string;
}

const DEFAULT_CELL =
  "h-8 w-8 min-h-8 max-h-8 sm:h-9 sm:w-9 sm:min-h-9 sm:max-h-9 lg:h-11 lg:w-11 lg:min-h-11 lg:max-h-11 [&_svg]:size-3 sm:[&_svg]:size-3.5 lg:[&_svg]:size-4";
const DEFAULT_VALUE =
  "h-4 w-5 text-[0.75rem] sm:h-5 sm:w-6 sm:text-body-sm lg:w-8 lg:text-body";

function stopBubble(event: MouseEvent) {
  event.stopPropagation();
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = MAX_CART_LINE_QUANTITY,
  disabled = false,
  disabledHint,
  className,
  controlClassName,
  valueClassName,
}: QuantitySelectorProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const editing = draft !== null;
  const cellClass = controlClassName ?? DEFAULT_CELL;
  const valueSizeClass = valueClassName ?? DEFAULT_VALUE;
  const atMin = disabled || value <= min;
  const atMax = disabled || value >= max;
  const maxHint =
    disabled && disabledHint
      ? disabledHint
      : max <= 1
        ? LABELS.onlyOneInStock
        : formatLabel(LABELS.maximumQuantityHint, { max });
  const minHint =
    disabled && disabledHint
      ? disabledHint
      : formatLabel(LABELS.minimumQuantityHint, { min });

  const commit = (raw: string) => {
    setDraft(null);
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      onChange(min);
      return;
    }
    onChange(Math.min(max, Math.max(min, parsed)));
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (atMin) return;
    onChange(value - 1);
  };

  const handleIncrement = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (atMax) return;
    onChange(value + 1);
  };

  const beginEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setDraft(String(value));
  };

  const commitDraft = () => commit(draft ?? String(value));

  const onEditorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") setDraft(null);
  };

  const controlBtnClass = cn(
    "relative z-[1] inline-flex shrink-0 items-center justify-center text-ink",
    "touch-manipulation transition-colors hover:bg-paper",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    cellClass,
  );

  const decrementHintDisabled = !disabled && atMin;
  const incrementHintDisabled = !disabled && atMax;
  const isEditingUnlocked = editing && !disabled;
  const editQuantityLabel = formatLabel(LABELS.editQuantity, { value });
  const valueDigitClassName = cn(
    "font-mono font-medium tabular-nums text-ink",
    valueSizeClass,
  );

  const valueCell = isEditingUnlocked ? (
    <input
      type="number"
      inputMode="numeric"
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commitDraft}
      onKeyDown={onEditorKeyDown}
      onClick={stopBubble}
      className={cn(
        "relative z-[1] shrink-0 border-x border-line bg-transparent text-center font-mono font-medium tabular-nums text-ink outline-none [appearance:textfield] focus-visible:shadow-[inset_0_0_0_1px_var(--brand)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        cellClass,
      )}
      aria-label={LABELS.quantityField}
    />
  ) : (
    <button
      type="button"
      onClick={beginEdit}
      disabled={disabled}
      className={cn(controlBtnClass, "border-x border-line")}
      aria-label={editQuantityLabel}
    >
      <AnimatedQuantityValue
        value={value}
        className={valueSizeClass}
        digitClassName={valueDigitClassName}
      />
    </button>
  );

  const control = (
    <div
      className={cn(
        "relative z-[1] inline-flex shrink-0 items-center rounded-sm border border-line",
        className,
      )}
      onClick={stopBubble}
    >
      <DisabledActionHint
        disabled={decrementHintDisabled}
        message={minHint}
        className="relative z-[1] max-w-none shrink-0"
      >
        <button
          type="button"
          className={controlBtnClass}
          disabled={atMin}
          onClick={handleDecrement}
          aria-label={LABELS.decreaseQuantity}
        >
          <Minus size={12} />
        </button>
      </DisabledActionHint>

      {valueCell}

      <DisabledActionHint
        disabled={incrementHintDisabled}
        message={maxHint}
        className="relative z-[1] max-w-none shrink-0"
      >
        <button
          type="button"
          className={controlBtnClass}
          disabled={atMax}
          onClick={handleIncrement}
          aria-label={LABELS.increaseQuantity}
        >
          <Plus size={12} />
        </button>
      </DisabledActionHint>
    </div>
  );

  if (disabled && disabledHint) {
    return (
      <DisabledActionHint disabled message={disabledHint} className="shrink-0">
        {control}
      </DisabledActionHint>
    );
  }

  return control;
}
