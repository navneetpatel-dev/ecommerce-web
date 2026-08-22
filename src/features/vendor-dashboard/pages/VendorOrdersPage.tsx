"use client";

import { useVendorOrderManagement } from "../hooks/useVendorOrderManagement";
import { SkeletonRows } from "@/shared/components/Skeletons";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  VendorOrdersTable,
  type VendorOrder,
} from "../components/VendorOrdersTable";
import { RequirePermission } from "@/shared/components/RequirePermission";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";

export function VendorOrdersPage() {
  const orders = useVendorOrderManagement();

  if (orders.isLoading) return <SkeletonRows count={5} />;
  if (!orders.data?.items?.length)
    return <EmptyState message={LABELS.noOrdersFound} />;

  return (
    <RequirePermission permission={PERMISSIONS.SUBORDER_MANAGE}>
      {orders.statusError ? (
        <p role="alert" className="mb-3 text-[0.8125rem] text-danger">
          {orders.statusError}
        </p>
      ) : null}
      <VendorOrdersTable
        orders={orders.data.items as VendorOrder[]}
        updatingId={orders.updatingId}
        onSetUpdatingId={orders.setUpdatingId}
        onStatusChange={orders.handleStatusChange}
      />
    </RequirePermission>
  );
}
