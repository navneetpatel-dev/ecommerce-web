"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectOption,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import { FormFieldFrame } from "@/shared/components/forms";
import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import { adminApi } from "../../api/analytics/admin.api";
import type { VendorInfo } from "@/shared/api/types";

interface AdminVendorFilterSelectProps {
  value: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  status?: string;
}

const vendorPageCache = new Map<string, InfiniteSingleSelectPageResult>();

function formatVendorSublabel(v: VendorInfo): string {
  const parts: string[] = [];
  if (v.slug) parts.push(`@${v.slug}`);
  if (v.state) parts.push(v.state);
  parts.push(`#${v.id.slice(0, 6)}`);
  return parts.join(" · ");
}

export function AdminVendorFilterSelect({
  value,
  onChange,
  label = "Vendor",
  placeholder = "All Vendors",
  status,
}: AdminVendorFilterSelectProps) {
  const { data: selectedVendor } = useQuery({
    queryKey: ["admin", "vendors", "detail", value],
    queryFn: () => apiClient.get<VendorInfo>(API.vendors.detail(value)),
    enabled: Boolean(value),
    staleTime: 5 * 60 * 1000,
  });

  const pinnedOption = useMemo<InfiniteSingleSelectOption | null>(() => {
    if (!selectedVendor) return null;
    return {
      id: selectedVendor.id,
      label: selectedVendor.businessName,
      sublabel: formatVendorSublabel(selectedVendor),
    };
  }, [selectedVendor]);

  const fetchPage = useCallback(
    async (
      query: InfiniteSingleSelectPageQuery,
    ): Promise<InfiniteSingleSelectPageResult> => {
      const cacheKey = `${status ?? ""}:${query.search ?? ""}:${query.page}:${query.limit}`;
      const cached = vendorPageCache.get(cacheKey);
      if (cached) return cached;

      const res = await adminApi.vendors({
        page: query.page,
        limit: query.limit,
        search: query.search,
        status,
      });
      const pageResult: InfiniteSingleSelectPageResult = {
        items: res.items.map((v) => ({
          id: v.id,
          label: v.businessName,
          sublabel: formatVendorSublabel(v),
        })),
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
      };
      vendorPageCache.set(cacheKey, pageResult);
      return pageResult;
    },
    [status],
  );

  return (
    <FormFieldFrame label={label}>
      <InfiniteSingleSelect
        value={value}
        onChange={(id) => onChange?.(id)}
        fetchPage={fetchPage}
        pinnedOption={pinnedOption}
        allowNone
        searchable
        noneLabel={placeholder}
        placeholder={placeholder}
        searchPlaceholder="Search vendor name or slug..."
        emptyMessage="No vendors found"
        pageSize={25}
      />
    </FormFieldFrame>
  );
}
