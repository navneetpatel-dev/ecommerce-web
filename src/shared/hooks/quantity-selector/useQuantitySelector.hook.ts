import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart/cart";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { cn } from "@/shared/utils/dom/cn";
import {
  DEFAULT_CELL,
  DEFAULT_VALUE,
  QUANTITY_CONTROL_BUTTON_BASE,
  QUANTITY_INPUT_BASE,
  QUANTITY_VALUE_DIGIT,
} from "../../styles/quantity-selector/quantitySelector.styles";

export interface UseQuantitySelectorParams {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  disabledHint?: string;
  controlClassName?: string;
  valueClassName?: string;
}

export function useQuantitySelector({
  value,
  onChange,
  min = 1,
  max = MAX_CART_LINE_QUANTITY,
  disabled = false,
  disabledHint,
  controlClassName,
  valueClassName,
}: UseQuantitySelectorParams) {
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

  const handleDecrement = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (atMin) return;
    onChange(value - 1);
  };

  const handleIncrement = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (atMax) return;
    onChange(value + 1);
  };

  const beginEdit = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    setDraft(String(value));
  };

  const commitDraft = () => commit(draft ?? String(value));

  const handleEditorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") setDraft(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
  };

  const handleStopBubble = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const controlBtnClass = cn(QUANTITY_CONTROL_BUTTON_BASE, cellClass);
  const inputClass = cn(QUANTITY_INPUT_BASE, cellClass);
  const valueDigitClassName = cn(QUANTITY_VALUE_DIGIT, valueSizeClass);
  const editQuantityLabel = formatLabel(LABELS.editQuantity, { value });

  return {
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
  };
}
