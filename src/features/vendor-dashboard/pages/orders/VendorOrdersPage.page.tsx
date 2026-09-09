"use client";

import { useVendorOrderManagement } from "../../hooks/orders/useVendorOrderManagement.hook";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { EmptyState } from "@/shared/components/EmptyState.component";
import {
  VendorOrdersTable,
  type VendorSubOrder,
} from "../../components/orders/VendorOrdersTable.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function VendorOrdersPage() {
  const orders = useVendorOrderManagement();

  if (orders.isLoading) return <SkeletonRows count={5} />;
  if (!orders.data?.items?.length)
    return <EmptyState message={LABELS.noOrdersFound} />;

  return (
    <RequirePermission permission={PERMISSIONS.SUBORDER_MANAGE}>
      {orders.statusError ? (
        <p role="alert" className={vendorPagesStyles.errorAlert}>
          {orders.statusError}
        </p>
      ) : null}
      <VendorOrdersTable
        orders={orders.data.items as unknown as VendorSubOrder[]}
        updatingId={orders.updatingId}
        onSetUpdatingId={orders.setUpdatingId}
        onStatusChange={orders.handleStatusChange}
      />
    </RequirePermission>
  );
}
