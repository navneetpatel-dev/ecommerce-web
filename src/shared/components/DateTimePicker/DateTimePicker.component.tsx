"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { dateTimePickerStyles } from "../../styles/date-time-picker/dateTimePicker.styles";
import { CalendarGrid } from "./CalendarGrid.component";
import { TimeSelectors } from "./TimeSelectors.component";
import { useDateTimePicker } from "./useDateTimePicker.hook";
import { formatDisplay, monthLabel } from "../../utils/date-time-picker/utils";

interface DateTimePickerProps {
  value?: string;
  /**
   * `datetime` → ISO string. `date` → `YYYY-MM-DD` (filters / report ranges).
   */
  onChange: (value: string) => void;
  mode?: "date" | "datetime";
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  id?: string;
}

/** Shared calendar control — date-only or date+time. */
export function DateTimePicker({
  value,
  onChange,
  mode = "datetime",
  placeholder,
  disabled = false,
  error = false,
  className,
  id,
}: DateTimePickerProps) {
  const resolvedPlaceholder =
    placeholder ?? (mode === "date" ? LABELS.pickDate : LABELS.pickDateTime);
  const {
    open,
    selected,
    viewYear,
    viewMonth,
    draftDay,
    hour,
    minute,
    handleOpenChange,
    handleSelectDay,
    handleHourChange,
    handleMinuteChange,
    handlePreviousMonth,
    handleNextMonth,
    handleDone,
  } = useDateTimePicker(value, mode, onChange);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            dateTimePickerStyles.trigger.base,
            error
              ? dateTimePickerStyles.trigger.error
              : dateTimePickerStyles.trigger.defaultBorder,
            className,
          )}
        >
          <span
            className={cn(
              dateTimePickerStyles.trigger.labelBase,
              selected
                ? dateTimePickerStyles.trigger.labelSelected
                : dateTimePickerStyles.trigger.labelPlaceholder,
            )}
          >
            {selected ? formatDisplay(selected, mode) : resolvedPlaceholder}
          </span>
          <CalendarDays
            size={16}
            className={dateTimePickerStyles.trigger.icon}
            aria-hidden
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={dateTimePickerStyles.popoverContent}
      >
        <div className={dateTimePickerStyles.header}>
          <button
            type="button"
            aria-label={LABELS.previousMonth}
            className={dateTimePickerStyles.navButton}
            onClick={handlePreviousMonth}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <p className={dateTimePickerStyles.monthLabel}>
            {monthLabel(viewYear, viewMonth)}
          </p>
          <button
            type="button"
            aria-label={LABELS.nextMonth}
            className={dateTimePickerStyles.navButton}
            onClick={handleNextMonth}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>

        <CalendarGrid
          viewYear={viewYear}
          viewMonth={viewMonth}
          draftDay={draftDay}
          onSelectDay={handleSelectDay}
        />

        {mode === "datetime" ? (
          <TimeSelectors
            hour={hour}
            minute={minute}
            onHourChange={handleHourChange}
            onMinuteChange={handleMinuteChange}
          />
        ) : null}

        <div className={dateTimePickerStyles.footer}>
          <Button type="button" size="sm" variant="ghost" onClick={handleDone}>
            {LABELS.done}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
