"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { redeliverySlotPickerStyles } from "../../styles/orders/vendorOrderComponents.styles";

export const REDELIVERY_SLOTS = [
  "Tomorrow morning (9am - 12pm)",
  "Tomorrow afternoon (12pm - 4pm)",
  "Tomorrow evening (4pm - 8pm)",
];

/** Shared slot-picker for rescheduling a failed delivery or return-pickup attempt. */
export function RedeliverySlotPicker({
  currentSlot,
  onSubmit,
  isPending,
  prompt = "This attempt didn't go through — pick a new time window:",
}: {
  currentSlot?: string | null;
  onSubmit: (slot: string) => void;
  isPending?: boolean;
  prompt?: string;
}) {
  const [slot, setSlot] = useState("");
  const promptText = currentSlot ? `Requested: ${currentSlot}` : prompt;
  const confirmDisabled = !slot;
  const slotOptions = REDELIVERY_SLOTS.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ));

  return (
    <div className={redeliverySlotPickerStyles.container}>
      <p className={redeliverySlotPickerStyles.prompt}>{promptText}</p>
      <div className={redeliverySlotPickerStyles.controlsRow}>
        <Select value={slot} onValueChange={setSlot}>
          <SelectTrigger className={redeliverySlotPickerStyles.selectTrigger}>
            <SelectValue placeholder="Choose a time window" />
          </SelectTrigger>
          <SelectContent>{slotOptions}</SelectContent>
        </Select>
        <Button
          disabled={confirmDisabled}
          loading={isPending}
          onClick={() => onSubmit(slot)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
