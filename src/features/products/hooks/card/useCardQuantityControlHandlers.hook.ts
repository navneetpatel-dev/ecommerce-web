import { useCallback, type MouseEvent } from "react";

interface UseCardQuantityControlHandlersProps {
  value: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

export function useCardQuantityControlHandlers({
  value,
  max,
  disabled,
  onChange,
}: UseCardQuantityControlHandlersProps) {
  const atMax = value >= max;

  // The +/- buttons stop propagation themselves (see handleDecrease/handleIncrease),
  // so the container no longer needs a click guard of its own.

  const handleDecrease = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || value <= 0) return;
      onChange(value - 1);
    },
    [disabled, onChange, value],
  );

  const handleIncrease = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled || atMax) return;
      onChange(value + 1);
    },
    [disabled, atMax, onChange, value],
  );

  return {
    atMax,
    handleDecrease,
    handleIncrease,
  };
}
