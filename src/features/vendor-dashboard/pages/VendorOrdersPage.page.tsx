"use client";

import { useVendorOrderManagement } from "../hooks/useVendorOrderManagement.hook";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import {
  VendorOrdersTable,
  type VendorOrder,
} from "../components/VendorOrdersTable.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
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
        <p role="alert" className="mb-3 text-body-sm text-danger">
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
