"use client";

import { useMemo } from "react";
import { cn } from "@/shared/utils/cn";
import { WEEKDAYS, sameDay, startOfDay } from "./utils";

interface CalendarGridProps {
  viewYear: number;
  viewMonth: number;
  draftDay: Date;
  onSelectDay: (day: Date) => void;
}

export function CalendarGrid({
  viewYear,
  viewMonth,
  draftDay,
  onSelectDay,
}: CalendarGridProps) {
  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<Date | null> = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(new Date(viewYear, viewMonth, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const today = startOfDay(new Date());

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((d) => (
        <div
          key={d}
          className="flex h-8 items-center justify-center text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint"
        >
          {d}
        </div>
      ))}
      {days.map((day, i) => {
        if (!day) return <div key={`pad-${i}`} className="h-8" />;
        const isSelected = sameDay(day, draftDay);
        const isToday = sameDay(day, today);
        return (
          <button
            key={day.toISOString()}
            type="button"
            className={cn(
              "flex h-8 items-center justify-center rounded-sm text-[0.8125rem] tabular-nums transition-colors",
              isSelected
                ? "bg-brand font-semibold text-paper"
                : "text-ink hover:bg-brand-subtle",
              !isSelected && isToday && "ring-1 ring-brand/50",
            )}
            onClick={() => onSelectDay(day)}
          >
            {day.getDate()}
          </button>
        );
      })}
    </div>
  );
}
