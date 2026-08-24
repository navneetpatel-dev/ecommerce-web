"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  SUPPORT_TICKET_CATEGORY_VALUES,
  SUPPORT_TICKET_PRIORITY_VALUES,
  SUPPORT_TICKET_STATUS_VALUES,
  VENDOR_STATUS,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/shared/constants/statuses";
import { adminApi } from "@/features/admin-dashboard";
import type { TicketListParams } from "../api/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../utils/labels";

const ALL = "ALL";

export function useTicketFiltersFromUrl(): TicketListParams {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const status = searchParams.get("status") as SupportTicketStatus | null;
    const priority = searchParams.get(
      "priority",
    ) as SupportTicketPriority | null;
    const category = searchParams.get(
      "category",
    ) as SupportTicketCategory | null;
    const vendorId = searchParams.get("vendorId");
    return {
      status:
        status && SUPPORT_TICKET_STATUS_VALUES.includes(status)
          ? status
          : undefined,
      priority:
        priority && SUPPORT_TICKET_PRIORITY_VALUES.includes(priority)
          ? priority
          : undefined,
      category:
        category && SUPPORT_TICKET_CATEGORY_VALUES.includes(category)
          ? category
          : undefined,
      vendorId: vendorId || undefined,
    };
  }, [searchParams]);
}

export function TicketFilters({
  showVendorId = true,
}: {
  showVendorId?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  const fetchVendorPage = useCallback(
    async (
      query: InfiniteSingleSelectPageQuery,
    ): Promise<InfiniteSingleSelectPageResult> => {
      const result = await adminApi.vendors({
        page: query.page,
        limit: query.limit,
        search: query.search,
        status: VENDOR_STATUS.APPROVED,
      });
      return {
        items: result.items.map((vendor) => ({
          id: vendor.id,
          label: vendor.businessName,
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      };
    },
    [],
  );

  return (
    <div
      className={`grid gap-3 border border-line bg-surface-raised p-4 sm:grid-cols-2 ${
        showVendorId ? "lg:grid-cols-4" : "lg:grid-cols-3"
      }`}
    >
      <FormFieldFrame label={LABELS.status}>
        <Select
          value={searchParams.get("status") ?? ALL}
          onValueChange={(v) => setParam("status", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>
              {LABELS.ticketFilterAllStatuses}
            </SelectItem>
            {SUPPORT_TICKET_STATUS_VALUES.map((status) => (
              <SelectItem key={status} value={status}>
                {TICKET_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.priority}>
        <Select
          value={searchParams.get("priority") ?? ALL}
          onValueChange={(v) => setParam("priority", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllPriorities} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>
              {LABELS.ticketFilterAllPriorities}
            </SelectItem>
            {SUPPORT_TICKET_PRIORITY_VALUES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {TICKET_PRIORITY_LABEL[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.category}>
        <Select
          value={searchParams.get("category") ?? ALL}
          onValueChange={(v) => setParam("category", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>
              {LABELS.ticketFilterAllCategories}
            </SelectItem>
            {SUPPORT_TICKET_CATEGORY_VALUES.map((category) => (
              <SelectItem key={category} value={category}>
                {TICKET_CATEGORY_LABEL[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      {showVendorId ? (
        <FormFieldFrame label={LABELS.ticketFilterVendorId}>
          <InfiniteSingleSelect
            value={searchParams.get("vendorId") ?? ""}
            onChange={(id) => setParam("vendorId", id || null)}
            fetchPage={fetchVendorPage}
            allowNone
            searchable
            noneLabel={LABELS.ticketFilterAllVendors}
            placeholder={LABELS.ticketFilterAllVendors}
            searchPlaceholder={LABELS.searchVendors}
            emptyMessage={LABELS.noVendorsFound}
          />
        </FormFieldFrame>
      ) : null}
    </div>
  );
}
