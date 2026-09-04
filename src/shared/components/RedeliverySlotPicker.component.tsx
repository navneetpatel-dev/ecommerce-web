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

  return (
    <div className="space-y-2 rounded-md border border-line bg-surface-muted p-3">
      <p className="text-body-sm font-medium text-ink">
        {currentSlot ? `Requested: ${currentSlot}` : prompt}
      </p>
      <div className="flex gap-2">
        <Select value={slot} onValueChange={setSlot}>
          <SelectTrigger className="min-w-0 flex-1">
            <SelectValue placeholder="Choose a time window" />
          </SelectTrigger>
          <SelectContent>
            {REDELIVERY_SLOTS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={!slot}
          loading={isPending}
          onClick={() => onSubmit(slot)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
