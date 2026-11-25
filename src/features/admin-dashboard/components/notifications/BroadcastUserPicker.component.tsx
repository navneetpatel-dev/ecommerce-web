"use client";

import { useCallback } from "react";
import {
  notificationsApi,
  type BroadcastTargetUser,
} from "../../api/notifications/notifications.api";
import { InfiniteSearchSelect } from "./InfiniteSearchSelect.component";

interface BroadcastUserPickerProps {
  placeholder: string;
  selected: BroadcastTargetUser[];
  onChange: (next: BroadcastTargetUser[]) => void;
}

export function BroadcastUserPicker({
  placeholder,
  selected,
  onChange,
}: BroadcastUserPickerProps) {
  const loadPage = useCallback(
    (q: string, page: number) =>
      notificationsApi.searchBroadcastUsers(q, page, 20),
    [],
  );

  return (
    <InfiniteSearchSelect<BroadcastTargetUser>
      placeholder={placeholder}
      loadPage={loadPage}
      getId={(u) => u.id}
      getLabel={(u) => `${u.name} (${u.email})`}
      getSubLabel={(u) => u.role}
      selected={selected}
      multiple
      onChange={onChange}
    />
  );
}
