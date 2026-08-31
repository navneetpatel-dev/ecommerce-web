"use client";

import { useQuery } from "@tanstack/react-query";
import { useVendorCommissions, useVendorPayouts, vendorKeys } from "../api/vendor.queries";
import { commissionsApi } from "@/features/admin-dashboard/api/finance.api";

export function usePayoutsPage() {
  const { data: commissions, isLoading: loadingComm } = useVendorCommissions();
  const { data: payouts, isLoading: loadingPay } = useVendorPayouts();
  const { data: invoicesPage, isLoading: loadingInv } = useQuery({
    queryKey: [...vendorKeys.commissions.all, "invoices"],
    queryFn: () => commissionsApi.listInvoices({ page: 1, limit: 50 }),
  });

  return {
    commissions,
    payouts,
    invoices: invoicesPage?.items ?? [],
    loadingComm,
    loadingPay,
    loadingInv,
  };
}
