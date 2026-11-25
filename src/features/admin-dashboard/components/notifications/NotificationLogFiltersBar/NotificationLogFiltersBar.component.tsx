"use client";

import { useEffect, useState } from "react";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import { LABELS as EMAIL_LABELS } from "@/shared/constants/labels";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { FormFieldFrame } from "@/shared/components/forms";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import { useDebouncedCallback } from "@/shared/hooks/ui/use-debounce.hook";
import type { NotificationLogFilters } from "../../../api/notifications/notifications.api";
import { NOTIFICATION_TYPE_OPTIONS } from "../../../constants/notifications/notificationTypes";
import { NotificationFilterSelect } from "./NotificationFilterSelect.component";
import { useNotificationLogFiltersBar } from "../../../hooks/notifications/useNotificationLogFiltersBar.hook";

const CHANNEL_OPTIONS = ["EMAIL", "SMS", "PUSH"] as const;
const ERROR_CATEGORY_OPTIONS = [
  "TEMPORARY",
  "PERMANENT",
  "RENDER",
  "RECIPIENT",
  "CONFIG",
  "UNCERTAIN",
] as const;
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
  const {
    handleSearchChange,
    handleTypeChange,
    handleChannelChange,
    handleStatusChange,
    handleErrorCategoryChange,
  } = useNotificationLogFiltersBar({ filters, onChange });

  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");
  useEffect(() => {
    setSearchDraft(filters.search ?? "");
  }, [filters.search]);
  const debouncedSearchChange = useDebouncedCallback(handleSearchChange, 350);

  const activeCount =
    (searchDraft.trim() ? 1 : 0) +
    (filters.type ? 1 : 0) +
    (filters.channel ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.errorCategory ? 1 : 0);

  const handleClear = () => {
    setSearchDraft("");
    onChange({});
  };

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={handleClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
        <FormFieldFrame label="Recipient" htmlFor="notification-filter-search">
          <SearchInput
            id="notification-filter-search"
            value={searchDraft}
            onChange={(e) => {
              setSearchDraft(e.target.value);
              debouncedSearchChange(e.target.value);
            }}
            onClear={() => {
              setSearchDraft("");
              handleSearchChange("");
            }}
            placeholder="Search by recipient email..."
          />
        </FormFieldFrame>
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
        <NotificationFilterSelect
          label={EMAIL_LABELS.notificationFilterErrorCategory}
          placeholder={EMAIL_LABELS.notificationFilterAllCategories}
          value={filters.errorCategory}
          options={ERROR_CATEGORY_OPTIONS}
          onChange={handleErrorCategoryChange}
        />
      </div>
    </CollapsibleTableFilters>
  );
}
