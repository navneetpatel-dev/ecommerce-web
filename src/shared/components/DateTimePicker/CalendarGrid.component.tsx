"use client";

import { useMemo } from "react";
import { cn } from "@/shared/utils/dom/cn";
import { dateTimePickerStyles } from "../../styles/date-time-picker/dateTimePicker.styles";
import { WEEKDAYS, sameDay, startOfDay } from "../../utils/date-time-picker/utils";

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
    <div className={dateTimePickerStyles.calendar.grid}>
      {WEEKDAYS.map((d) => (
        <div key={d} className={dateTimePickerStyles.calendar.weekdayHeader}>
          {d}
        </div>
      ))}
      {days.map((day, i) => {
        if (!day)
          return (
            <div
              key={`pad-${i}`}
              className={dateTimePickerStyles.calendar.emptyCell}
            />
          );
        const isSelected = sameDay(day, draftDay);
        const isToday = sameDay(day, today);
        return (
          <button
            key={day.toISOString()}
            type="button"
            className={cn(
              dateTimePickerStyles.calendar.dayButtonBase,
              isSelected
                ? dateTimePickerStyles.calendar.dayButtonSelected
                : dateTimePickerStyles.calendar.dayButtonDefault,
              !isSelected &&
                isToday &&
                dateTimePickerStyles.calendar.dayButtonToday,
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
