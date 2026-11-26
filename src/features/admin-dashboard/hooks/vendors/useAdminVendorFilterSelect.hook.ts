"use client";

import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  InfiniteSingleSelectOption,
  InfiniteSingleSelectPageQuery,
  InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect";
import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import type { VendorInfo } from "@/shared/api/types";
import { vendorsApi } from "@/features/vendors";
import { createPageCache } from "@/shared/utils/infinite-single-select/pageCache";
import { adminApi } from "../../api/analytics/admin.api";
import {
  directoryItemToOption,
  toPageResult,
  vendorInfoToOption,
} from "../../utils/vendors/vendorFilterOptions";

const SELECTED_STALE_MS = 5 * 60 * 1000;
const vendorPageCache = createPageCache<InfiniteSingleSelectPageResult>();

interface UseAdminVendorFilterSelectArgs {
  value: string;
  onChange?: (value: string) => void;
  status?: string;
}

/**
 * Vendor dropdown data. Vendor managers (vendor.manage / vendor.approve) browse the full admin list,
 * which carries any status and each vendor's details. Everyone else who filters by vendor (the
 * Catalog, Order and Finance managers) uses the approved-vendor directory, because the admin list
 * refuses them.
 */
export function useAdminVendorFilterSelect({
  value,
  onChange,
  status,
}: UseAdminVendorFilterSelectArgs) {
  const { hasAnyPermission } = usePermissions();
  const canManageVendors = hasAnyPermission(
    PERMISSIONS.VENDOR_MANAGE,
    PERMISSIONS.VENDOR_APPROVE,
  );
  // Picking an approved vendor needs only an id and a name: the light directory serves that for everyone.
  // The full admin list is for browsing vendors of any status.
  const useAdminList = canManageVendors && status !== "APPROVED";
  const source = useAdminList ? "admin" : "directory";

  const { data: selectedOption } = useQuery<InfiniteSingleSelectOption | null>({
    queryKey: ["admin", "vendors", "selected", source, value],
    queryFn: async () => {
      if (useAdminList) {
        const vendor = await apiClient.get<VendorInfo>(
          API.vendors.detail(value),
        );
        return vendorInfoToOption(vendor);
      }
      const res = await vendorsApi.directory({ id: value, page: 1, limit: 1 });
      const found = res.items[0];
      return found ? directoryItemToOption(found) : null;
    },
    enabled: Boolean(value),
    staleTime: SELECTED_STALE_MS,
  });

  const pinnedOption = useMemo(() => selectedOption ?? null, [selectedOption]);

  const fetchPage = useCallback(
    async (
      query: InfiniteSingleSelectPageQuery,
    ): Promise<InfiniteSingleSelectPageResult> => {
      const cacheKey = `${source}:${status ?? ""}:${query.search ?? ""}:${query.page}:${query.limit}`;
      const cached = vendorPageCache.get(cacheKey);
      if (cached) return cached;

      const pageResult = useAdminList
        ? toPageResult(
            await adminApi.vendors({
              page: query.page,
              limit: query.limit,
              search: query.search,
              status,
            }),
            vendorInfoToOption,
          )
        : toPageResult(
            await vendorsApi.directory({
              page: query.page,
              limit: query.limit,
              search: query.search,
            }),
            directoryItemToOption,
          );
      vendorPageCache.set(cacheKey, pageResult);
      return pageResult;
    },
    [useAdminList, source, status],
  );

  const handleChange = useCallback(
    (id: string) => {
      onChange?.(id);
    },
    [onChange],
  );

  return { fetchPage, pinnedOption, handleChange, resetKey: source };
}
