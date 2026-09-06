"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import type { NotificationLogFilters } from "../api/notifications.api";
import { NOTIFICATION_TYPE_OPTIONS } from "../constants/notificationTypes";

const ALL = "__ALL__";

const CHANNEL_OPTIONS = ["EMAIL", "SMS", "PUSH"] as const;
const STATUS_OPTIONS = [
  "PENDING",
  "SENT",
  "FAILED",
  "BOUNCED",
  "COMPLAINED",
] as const;

interface NotificationLogFiltersBarProps {
  filters: NotificationLogFilters;
  onChange: (filters: NotificationLogFilters) => void;
}

export function NotificationLogFiltersBar({
  filters,
  onChange,
}: NotificationLogFiltersBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <FilterSelect
        label={LABELS.notificationFilterType}
        placeholder={LABELS.notificationFilterAllTypes}
        value={filters.type}
        options={NOTIFICATION_TYPE_OPTIONS}
        onChange={(value) => onChange({ ...filters, type: value })}
      />
      <FilterSelect
        label={LABELS.notificationFilterChannel}
        placeholder={LABELS.notificationFilterAllChannels}
        value={filters.channel}
        options={CHANNEL_OPTIONS}
        onChange={(value) => onChange({ ...filters, channel: value })}
      />
      <FilterSelect
        label={LABELS.notificationFilterStatus}
        placeholder={LABELS.notificationFilterAllStatuses}
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(value) => onChange({ ...filters, status: value })}
      />
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  placeholder: string;
  value: string | undefined;
  options: readonly string[];
  onChange: (value: string | undefined) => void;
}

function FilterSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="w-44 space-y-1">
      <span className="text-body-sm text-ink-muted">{label}</span>
      <Select
        value={value ?? ALL}
        onValueChange={(next) => onChange(next === ALL ? undefined : next)}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
