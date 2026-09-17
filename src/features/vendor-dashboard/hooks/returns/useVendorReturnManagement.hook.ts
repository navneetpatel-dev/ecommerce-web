import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { returnsApi } from "@/features/returns";
import { vendorKeys } from "../../api/overview/vendor.queries";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

/**
 * Vendor return management data: list of returns on this vendor's suborders.
 */
export function useVendorReturnManagement() {
  const [page] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: vendorKeys.returns.page(page),
    queryFn: () => returnsApi.vendorList(page),
  });

  const loadError = isError
    ? getApiErrorMessage(error, LABELS.couldNotLoadReturns)
    : null;

  return {
    data,
    isLoading,
    loadError,
  };
}
