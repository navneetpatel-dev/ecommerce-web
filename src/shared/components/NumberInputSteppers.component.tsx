import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";

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
        onClick={() => onBump(1)}
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
        onClick={() => onBump(-1)}
      >
        <ChevronDown size={14} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
