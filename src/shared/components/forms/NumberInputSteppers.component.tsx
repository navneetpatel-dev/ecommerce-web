import { ChevronDown, ChevronUp } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { numberInputStyles } from "../../styles/forms/numberInput.styles";

interface NumberInputSteppersProps {
  disabled?: boolean;
  atMin: boolean;
  atMax: boolean;
  onBump: (direction: 1 | -1) => void;
}

/** Vertical up/down stepper buttons for NumberInput. */
export function NumberInputSteppers({
  disabled,
  atMin,
  atMax,
  onBump,
}: NumberInputSteppersProps) {
  return (
    <div className={numberInputStyles.stepperContainer}>
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || atMax}
        aria-label={LABELS.increaseValue}
        className={numberInputStyles.stepperBtn}
        onClick={() => onBump(1)}
      >
        <ChevronUp size={14} strokeWidth={2.25} aria-hidden />
      </button>
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled || atMin}
        aria-label={LABELS.decreaseValue}
        className={numberInputStyles.stepperBtnDown}
        onClick={() => onBump(-1)}
      >
        <ChevronDown size={14} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
