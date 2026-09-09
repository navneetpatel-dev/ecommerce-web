import { useCallback } from "react";
import type { NotificationLogFilters } from "../../api/notifications.api";

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

  return {
    handleTypeChange,
    handleChannelChange,
    handleStatusChange,
  };
}
