"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { CalendarGrid } from "./CalendarGrid.component";
import { TimeSelectors } from "./TimeSelectors.component";
import {
  formatDisplay,
  monthLabel,
  parseValue,
  roundMinute,
  startOfDay,
  toDateOnly,
  toIso,
} from "./utils";

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
  const selected = parseValue(value);
  const [open, setOpen] = useState(false);
  const initial = selected ?? new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [draftDay, setDraftDay] = useState<Date>(startOfDay(initial));
  const [hour, setHour] = useState(String(initial.getHours()).padStart(2, "0"));
  const [minute, setMinute] = useState(
    String(roundMinute(initial.getMinutes())).padStart(2, "0"),
  );

  const syncFromValue = () => {
    const base = parseValue(value) ?? new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setDraftDay(startOfDay(base));
    setHour(String(base.getHours()).padStart(2, "0"));
    setMinute(String(roundMinute(base.getMinutes())).padStart(2, "0"));
  };

  const apply = (day: Date, h: string, m: string, close = false) => {
    if (mode === "date") {
      onChange(toDateOnly(day));
      if (close) setOpen(false);
      return;
    }
    const next = new Date(day);
    next.setHours(Number(h), Number(m), 0, 0);
    onChange(toIso(next));
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (next) syncFromValue();
        setOpen(next);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={cn(
            "flex h-11 w-full min-w-[10rem] cursor-pointer items-center justify-between gap-3 rounded-sm border bg-surface-raised px-3.5 text-left text-body outline-none",
            "hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger" : "border-line-strong",
            className,
          )}
        >
          <span
            className={cn("truncate", selected ? "text-ink" : "text-ink-faint")}
          >
            {selected ? formatDisplay(selected, mode) : resolvedPlaceholder}
          </span>
          <CalendarDays
            size={16}
            className="shrink-0 ml-1 text-ink-muted"
            aria-hidden
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[min(100vw-2rem,20rem)] space-y-4 p-3"
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label={LABELS.previousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <p className="text-[0.875rem] font-semibold tracking-tight text-ink">
            {monthLabel(viewYear, viewMonth)}
          </p>
          <button
            type="button"
            aria-label={LABELS.nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper hover:text-ink"
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>

        <CalendarGrid
          viewYear={viewYear}
          viewMonth={viewMonth}
          draftDay={draftDay}
          onSelectDay={(day) => {
            setDraftDay(day);
            apply(day, hour, minute, mode === "date");
          }}
        />

        {mode === "datetime" ? (
          <TimeSelectors
            hour={hour}
            minute={minute}
            onHourChange={(h) => {
              setHour(h);
              apply(draftDay, h, minute);
            }}
            onMinuteChange={(m) => {
              setMinute(m);
              apply(draftDay, hour, m);
            }}
          />
        ) : null}

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            {LABELS.done}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
