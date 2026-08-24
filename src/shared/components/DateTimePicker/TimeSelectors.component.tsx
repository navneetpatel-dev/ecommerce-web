"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { HOURS, MINUTES } from "./utils";

interface TimeSelectorsProps {
  hour: string;
  minute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
}

export function TimeSelectors({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: TimeSelectorsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-line pt-3">
      <div className="space-y-1.5">
        <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
          {LABELS.hour}
        </p>
        <Select value={hour} onValueChange={onHourChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HOURS.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
          {LABELS.minute}
        </p>
        <Select value={minute} onValueChange={onMinuteChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MINUTES.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
