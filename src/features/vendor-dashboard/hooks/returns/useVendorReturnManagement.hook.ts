import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { returnsApi } from "@/features/returns";
import { vendorKeys } from "../../api/overview/vendor.queries";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";

/**
 * Vendor return management data: list of returns on this vendor's suborders.
 */
export function useVendorReturnManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const queryFilters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
    }),
    [debouncedSearch, status],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: vendorKeys.returns.page(page, queryFilters),
    queryFn: () => returnsApi.vendorList(page, undefined, queryFilters),
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setPage(1);
  }, []);

  const loadError = isError
    ? getApiErrorMessage(error, LABELS.couldNotLoadReturns)
    : null;

  return {
    data,
    isLoading,
    loadError,
    page,
    setPage,
    totalPages: data?.totalPages ?? 1,
    total: data?.total ?? 0,
    filters: {
      search,
      status,
      onSearchChange: handleSearchChange,
      onStatusChange: handleStatusChange,
      onClear: handleClearFilters,
    },
    hasActiveFilters: Boolean(search || status),
  };
}
