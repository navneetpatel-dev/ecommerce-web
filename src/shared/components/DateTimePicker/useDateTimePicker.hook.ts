"use client";

import { useState } from "react";
import {
  parseValue,
  roundMinute,
  startOfDay,
  toDateOnly,
  toIso,
} from "../../utils/date-time-picker/utils";

type PickerMode = "date" | "datetime";

/** State machine for DateTimePicker: view month/day/time, apply + sync logic. */
export function useDateTimePicker(
  value: string | undefined,
  mode: PickerMode,
  onChange: (value: string) => void,
) {
  const selected = parseValue(value);
  const initial = selected ?? new Date();
  const [open, setOpen] = useState(false);
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

  const handleOpenChange = (next: boolean) => {
    if (next) syncFromValue();
    setOpen(next);
  };

  const handleSelectDay = (day: Date) => {
    setDraftDay(day);
    apply(day, hour, minute, mode === "date");
  };

  const handleHourChange = (nextHour: string) => {
    setHour(nextHour);
    apply(draftDay, nextHour, minute);
  };

  const handleMinuteChange = (nextMinute: string) => {
    setMinute(nextMinute);
    apply(draftDay, hour, nextMinute);
  };

  const handlePreviousMonth = () => {
    shiftMonth(-1);
  };

  const handleNextMonth = () => {
    shiftMonth(1);
  };

  const handleDone = () => {
    setOpen(false);
  };

  return {
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
  };
}
