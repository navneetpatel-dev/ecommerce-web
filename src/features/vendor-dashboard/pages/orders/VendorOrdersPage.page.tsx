"use client";

import { useVendorOrderManagement } from "../../hooks/orders/useVendorOrderManagement.hook";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import {
  VendorOrdersTable,
  type VendorSubOrder,
} from "../../components/orders/VendorOrdersTable.component";
import { VendorOrdersFilters } from "../../components/orders/VendorOrdersFilters.component";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function VendorOrdersPage() {
  const orders = useVendorOrderManagement();

  return (
    <RequirePermission permission={PERMISSIONS.SUBORDER_MANAGE}>
      <VendorOrdersFilters {...orders.filters} />
      {orders.statusError ? (
        <p role="alert" className={vendorPagesStyles.errorAlert}>
          {orders.statusError}
        </p>
      ) : null}
      {orders.isLoading ? (
        <SkeletonRows count={5} />
      ) : !orders.data?.items?.length ? (
        <EmptyState
          message={
            orders.hasActiveFilters
              ? "No orders found matching your search and filter criteria."
              : LABELS.noOrdersFound
          }
        />
      ) : (
        <>
          <VendorOrdersTable
            orders={orders.data.items as unknown as VendorSubOrder[]}
            updatingId={orders.updatingId}
            statusError={orders.statusError}
            statusErrorId={orders.statusErrorId}
            onSetUpdatingId={orders.setUpdatingId}
            onStatusChange={orders.handleStatusChange}
          />
          {orders.totalPages > 1 ? (
            <PaginationContainer
              currentPage={orders.page}
              totalPages={orders.totalPages}
              onPageChange={orders.setPage}
            />
          ) : null}
        </>
      )}
    </RequirePermission>
  );
}
