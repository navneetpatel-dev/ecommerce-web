import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from "@/shared/components/InfiniteSingleSelect.component";
import { VENDOR_STATUS } from "@/shared/constants/statuses";
import { adminApi } from "@/features/admin-dashboard";

export const ALL = "ALL";

export function useTicketFiltersHandlers() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const handleStatusChange = useCallback(
    (v: string) => {
      setParam("status", v);
    },
    [setParam],
  );

  const handlePriorityChange = useCallback(
    (v: string) => {
      setParam("priority", v);
    },
    [setParam],
  );

  const handleCategoryChange = useCallback(
    (v: string) => {
      setParam("category", v);
    },
    [setParam],
  );

  const handleVendorChange = useCallback(
    (id: string | null) => {
      setParam("vendorId", id || null);
    },
    [setParam],
  );

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

  const currentStatus = searchParams.get("status") ?? ALL;
  const currentPriority = searchParams.get("priority") ?? ALL;
  const currentCategory = searchParams.get("category") ?? ALL;
  const currentVendorId = searchParams.get("vendorId") ?? "";

  return {
    currentStatus,
    currentPriority,
    currentCategory,
    currentVendorId,
    handleStatusChange,
    handlePriorityChange,
    handleCategoryChange,
    handleVendorChange,
    fetchVendorPage,
  };
}
