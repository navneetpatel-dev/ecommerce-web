"use client";

import { Minus, Plus } from "lucide-react";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { AnimatedQuantityValue } from "./AnimatedQuantityValue.component";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { useQuantitySelector } from "../../hooks/quantity-selector/useQuantitySelector.hook";
import {
  QUANTITY_SELECTOR_CONTAINER,
  QUANTITY_SELECTOR_EXTRA,
} from "../../styles/quantity-selector/quantitySelector.styles";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  disabledHint?: string;
  className?: string;
  controlClassName?: string;
  valueClassName?: string;
}

export function QuantitySelector(props: QuantitySelectorProps) {
  const { value, disabled = false, disabledHint, className } = props;

  const {
    editing,
    draft,
    atMin,
    atMax,
    minHint,
    maxHint,
    controlBtnClass,
    inputClass,
    valueSizeClass,
    valueDigitClassName,
    editQuantityLabel,
    handleDecrement,
    handleIncrement,
    beginEdit,
    commitDraft,
    handleEditorKeyDown,
    handleInputChange,
    handleStopBubble,
  } = useQuantitySelector(props);

  const decrementHintDisabled = !disabled && atMin;
  const incrementHintDisabled = !disabled && atMax;
  const isEditingUnlocked = editing && !disabled;

  const valueCell = isEditingUnlocked ? (
    <input
      type="number"
      inputMode="numeric"
      autoFocus
      value={draft ?? ""}
      onChange={handleInputChange}
      onBlur={commitDraft}
      onKeyDown={handleEditorKeyDown}
      onClick={handleStopBubble}
      className={inputClass}
      aria-label={LABELS.quantityField}
    />
  ) : (
    <button
      type="button"
      onClick={beginEdit}
      disabled={disabled}
      className={cn(controlBtnClass, QUANTITY_SELECTOR_EXTRA.borderX)}
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
      className={cn(QUANTITY_SELECTOR_CONTAINER, className)}
      onClick={handleStopBubble}
    >
      <DisabledActionHint
        disabled={decrementHintDisabled}
        message={minHint}
        className={QUANTITY_SELECTOR_EXTRA.hintContainer}
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
        className={QUANTITY_SELECTOR_EXTRA.hintContainer}
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
      <DisabledActionHint
        disabled
        message={disabledHint}
        className={QUANTITY_SELECTOR_EXTRA.disabledShrink}
      >
        {control}
      </DisabledActionHint>
    );
  }

  return control;
}
