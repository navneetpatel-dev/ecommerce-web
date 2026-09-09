"use client";

import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import type { NotificationLogFilters } from "../../../api/notifications/notifications.api";
import { NOTIFICATION_TYPE_OPTIONS } from "../../../constants/notifications/notificationTypes";
import { notificationLogFiltersBarStyles } from "./notificationLogFiltersBar.styles";
import { NotificationFilterSelect } from "./NotificationFilterSelect.component";
import { useNotificationLogFiltersBar } from "./useNotificationLogFiltersBar.hook";

const CHANNEL_OPTIONS = ["EMAIL", "SMS", "PUSH"] as const;
const STATUS_OPTIONS = [
  "PENDING",
  "SENT",
  "FAILED",
  "BOUNCED",
  "COMPLAINED",
] as const;

export interface NotificationLogFiltersBarProps {
  filters: NotificationLogFilters;
  onChange: (filters: NotificationLogFilters) => void;
}

export function NotificationLogFiltersBar({
  filters,
  onChange,
}: NotificationLogFiltersBarProps) {
  const { handleTypeChange, handleChannelChange, handleStatusChange } =
    useNotificationLogFiltersBar({ filters, onChange });

  return (
    <div className={notificationLogFiltersBarStyles.root}>
      <NotificationFilterSelect
        label={LABELS.notificationFilterType}
        placeholder={LABELS.notificationFilterAllTypes}
        value={filters.type}
        options={NOTIFICATION_TYPE_OPTIONS}
        onChange={handleTypeChange}
      />
      <NotificationFilterSelect
        label={LABELS.notificationFilterChannel}
        placeholder={LABELS.notificationFilterAllChannels}
        value={filters.channel}
        options={CHANNEL_OPTIONS}
        onChange={handleChannelChange}
      />
      <NotificationFilterSelect
        label={LABELS.notificationFilterStatus}
        placeholder={LABELS.notificationFilterAllStatuses}
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={handleStatusChange}
      />
    </div>
  );
}
