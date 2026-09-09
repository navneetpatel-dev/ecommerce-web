import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { cn } from "@/shared/utils/cn";

interface PaymentMethodOptionProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  disabled: boolean;
  disabledMessage?: string;
  onSelect: () => void;
}

/** A single selectable payment-method card, with an optional disabled-reason tooltip. */
export function PaymentMethodOption({
  title,
  description,
  icon: Icon,
  selected,
  disabled,
  disabledMessage,
  onSelect,
}: PaymentMethodOptionProps) {
  const button = (
    <Button
      type="button"
      variant="outline"
      aria-pressed={selected}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "h-auto min-h-11 max-h-none w-full items-start gap-4 px-4 py-4 text-left font-normal",
        selected
          ? "border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-brand-subtle hover:text-ink"
          : "border-line hover:border-ink/25",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
          selected
            ? "border-brand/40 bg-surface text-brand"
            : "border-line bg-paper text-ink-muted",
        )}
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-[0.875rem] text-ink-muted">
          {description}
        </span>
      </span>
      <span
        className={cn(
          "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-brand bg-brand" : "border-line bg-surface",
        )}
        aria-hidden
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
      </span>
    </Button>
  );

  if (disabledMessage) {
    return (
      <DisabledActionHint disabled message={disabledMessage} className="w-full">
        {button}
      </DisabledActionHint>
    );
  }

  return <div className="w-full">{button}</div>;
}
