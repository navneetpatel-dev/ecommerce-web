import { DateTimePicker } from "@/shared/components/DateTimePicker.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";

interface DateRangeFieldsProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  fromId?: string;
  toId?: string;
  className?: string;
  fromClassName?: string;
  toClassName?: string;
  disabled?: boolean;
  disabledHint?: string;
}

/** Shared From/To date filters using `DateTimePicker` date mode (`YYYY-MM-DD`). */
export function DateRangeFields({
  from,
  to,
  onFromChange,
  onToChange,
  fromId = "date-from",
  toId = "date-to",
  className,
  fromClassName,
  toClassName,
  disabled = false,
  disabledHint = "",
}: DateRangeFieldsProps) {
  const hint = disabled ? disabledHint : "";

  return (
    <div className={cn("contents", className)}>
      <FormFieldFrame
        label={LABELS.reportDateFrom}
        htmlFor={fromId}
        className={cn("w-40 sm:w-44", fromClassName)}
      >
        <DisabledActionHint disabled={disabled} message={hint} block>
          <DateTimePicker
            id={fromId}
            mode="date"
            value={from}
            onChange={onFromChange}
            placeholder={LABELS.pickDate}
            disabled={disabled}
          />
        </DisabledActionHint>
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.reportDateTo}
        htmlFor={toId}
        className={cn("w-40 sm:w-44", toClassName)}
      >
        <DisabledActionHint disabled={disabled} message={hint} block>
          <DateTimePicker
            id={toId}
            mode="date"
            value={to}
            onChange={onToChange}
            placeholder={LABELS.pickDate}
            disabled={disabled}
          />
        </DisabledActionHint>
      </FormFieldFrame>
    </div>
  );
}
