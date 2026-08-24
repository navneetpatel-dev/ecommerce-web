import { DateTimePicker } from "@/shared/components/DateTimePicker.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

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
}: DateRangeFieldsProps) {
  return (
    <div className={cn("contents", className)}>
      <FormFieldFrame
        label={LABELS.reportDateFrom}
        htmlFor={fromId}
        className={fromClassName}
      >
        <DateTimePicker
          id={fromId}
          mode="date"
          value={from}
          onChange={onFromChange}
          placeholder={LABELS.pickDate}
        />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.reportDateTo}
        htmlFor={toId}
        className={toClassName}
      >
        <DateTimePicker
          id={toId}
          mode="date"
          value={to}
          onChange={onToChange}
          placeholder={LABELS.pickDate}
        />
      </FormFieldFrame>
    </div>
  );
}
