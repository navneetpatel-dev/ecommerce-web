"use client";

import { useMemo, useState } from "react";
import {
  redeliveryDayOptions,
  type RedeliveryChoice,
  type RedeliveryWindow,
} from "@/shared/utils/orders/redeliveryOptions";

/** Day + window state for the redelivery picker (B-45). */
export function useRedeliverySlotPicker(
  onSubmit: (choice: RedeliveryChoice) => void,
) {
  const dayOptions = useMemo(() => redeliveryDayOptions(), []);
  const [date, setDate] = useState("");
  const [window, setWindow] = useState<RedeliveryWindow | "">("");

  const handleWindowChange = (value: string) =>
    setWindow(value as RedeliveryWindow);
  const handleConfirm = () => {
    if (date && window) onSubmit({ date, window });
  };

  return {
    dayOptions,
    date,
    window,
    confirmDisabled: !date || !window,
    handleDateChange: setDate,
    handleWindowChange,
    handleConfirm,
  };
}
