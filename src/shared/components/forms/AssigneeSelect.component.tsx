"use client";

import { useCallback, useMemo } from "react";
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect.component";
import {
  assigneesApi,
  type AssigneePermission,
} from "@/shared/api/assignees.api";
import { LABELS } from "@/shared/constants/labels";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";

type Props = {
  permission: AssigneePermission;
  value: string;
  onChange: (userId: string) => void;
  /** Keep a current assignee visible even if they are not in the eligible list. */
  currentOption?: { id: string; name: string; email?: string | null } | null;
  /** When set, scopes ticket assignees to staff for this vendor. */
  vendorId?: string | null;
  allowNone?: boolean;
  noneLabel?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
};

function formatAssignee(user: { name: string; email?: string | null }): string {
  if (user.email) return `${user.name} (${user.email})`;
  return user.name;
}

export function AssigneeSelect({
  permission,
  value,
  onChange,
  currentOption,
  vendorId,
  allowNone = false,
  noneLabel = LABELS.ticketAssigneeNone,
  disabled,
  className,
  error,
}: Props) {
  const fetchPage = useCallback(
    async (
      query: InfiniteSingleSelectPageQuery,
    ): Promise<InfiniteSingleSelectPageResult> => {
      const result = await assigneesApi.listAssignees({
        permission,
        page: query.page,
        limit: query.limit,
        search: query.search,
        vendorId: vendorId || undefined,
      });
      return {
        items: result.items.map((user) => ({
          id: user.id,
          label: formatAssignee(user),
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      };
    },
    [permission, vendorId],
  );

  const pinnedOption = useMemo(() => {
    if (!currentOption?.id) return null;
    return {
      id: currentOption.id,
      label: formatAssignee(currentOption),
    };
  }, [currentOption]);

  return (
    <InfiniteSingleSelect
      value={value}
      onChange={onChange}
      fetchPage={fetchPage}
      resetKey={`${permission}:${vendorId ?? ""}`}
      pinnedOption={pinnedOption}
      allowNone={allowNone}
      noneLabel={noneLabel}
      placeholder={LABELS.ticketAssigneePlaceholder}
      searchPlaceholder={LABELS.searchUsers}
      emptyMessage={LABELS.ticketAssigneesEmpty}
      disabled={disabled}
      error={error}
      pageSize={DEFAULT_PAGE_LIMIT}
      className={className}
    />
  );
}
