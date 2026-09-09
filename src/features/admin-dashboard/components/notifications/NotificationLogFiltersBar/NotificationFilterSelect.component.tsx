import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { notificationLogFiltersBarStyles } from "../../../styles/notifications/notificationLogFiltersBar.styles";
import {
  NotificationFilterOptionsList,
  ALL,
} from "./NotificationFilterOptionsList.component";

interface NotificationFilterSelectProps {
  label: string;
  placeholder: string;
  value: string | undefined;
  options: readonly string[];
  onChange: (value: string | undefined) => void;
}

export function NotificationFilterSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: NotificationFilterSelectProps) {
  const handleValueChange = useCallback(
    (next: string) => {
      onChange(next === ALL ? undefined : next);
    },
    [onChange],
  );

  return (
    <div className={notificationLogFiltersBarStyles.filterSelect}>
      <span className={notificationLogFiltersBarStyles.label}>{label}</span>
      <Select value={value ?? ALL} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <NotificationFilterOptionsList
            placeholder={placeholder}
            options={options}
          />
        </SelectContent>
      </Select>
    </div>
  );
}
