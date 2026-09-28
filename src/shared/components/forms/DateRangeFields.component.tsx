import { DateTimePicker } from "@/shared/components/DateTimePicker";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { dateRangeFieldsStyles } from "../../styles/forms/forms.styles";

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
    <div className={cn(dateRangeFieldsStyles.wrapper, className)}>
      <FormFieldFrame
        label={LABELS.reportDateFrom}
        htmlFor={fromId}
        className={cn(dateRangeFieldsStyles.field, fromClassName)}
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
        className={cn(dateRangeFieldsStyles.field, toClassName)}
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
