"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { dateTimePickerStyles } from "../../styles/date-time-picker/dateTimePicker.styles";
import { HOURS, MINUTES } from "../../utils/date-time-picker/utils";

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
    <div className={dateTimePickerStyles.timeSelectors.container}>
      <div className={dateTimePickerStyles.timeSelectors.fieldGroup}>
        <p className={dateTimePickerStyles.timeSelectors.label}>
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
      <div className={dateTimePickerStyles.timeSelectors.fieldGroup}>
        <p className={dateTimePickerStyles.timeSelectors.label}>
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
