import { useCallback } from "react";
import type { NotificationLogFilters } from "../../api/notifications/notifications.api";

interface UseNotificationLogFiltersBarProps {
  filters: NotificationLogFilters;
  onChange: (filters: NotificationLogFilters) => void;
}

export function useNotificationLogFiltersBar({
  filters,
  onChange,
}: UseNotificationLogFiltersBarProps) {
  const handleTypeChange = useCallback(
    (value: string | undefined) => {
      onChange({ ...filters, type: value });
    },
    [filters, onChange],
  );

  const handleChannelChange = useCallback(
    (value: string | undefined) => {
      onChange({ ...filters, channel: value });
    },
    [filters, onChange],
  );

  const handleStatusChange = useCallback(
    (value: string | undefined) => {
      onChange({ ...filters, status: value });
    },
    [filters, onChange],
  );

  const handleErrorCategoryChange = useCallback(
    (value: string | undefined) => {
      onChange({ ...filters, errorCategory: value });
    },
    [filters, onChange],
  );

  const handleSearchChange = useCallback(
    (value: string | undefined) => {
      onChange({ ...filters, search: value });
    },
    [filters, onChange],
  );

  return {
    handleSearchChange,
    handleTypeChange,
    handleChannelChange,
    handleStatusChange,
    handleErrorCategoryChange,
  };
}
