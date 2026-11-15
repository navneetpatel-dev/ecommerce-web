"use client";

import { useVendorReturnManagement } from "../../hooks/returns/useVendorReturnManagement.hook";
import { SkeletonRows } from "@/shared/components/Skeletons.component";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { VendorReturnsTable } from "../../components/returns/VendorReturnsTable.component";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function VendorReturnsPage() {
  const returns = useVendorReturnManagement();

  if (returns.isLoading) return <SkeletonRows count={5} />;
  if (returns.loadError) {
    return (
      <p role="alert" className={vendorPagesStyles.errorAlert}>
        {returns.loadError}
      </p>
    );
  }
  if (!returns.data?.items?.length) {
    return <EmptyState message={LABELS.noReturnsYet} />;
  }

  return (
    <RequirePermission permission={PERMISSIONS.SUBORDER_MANAGE}>
      <VendorReturnsTable returns={returns.data.items} />
      {returns.totalPages > 1 ? (
        <PaginationContainer
          currentPage={returns.page}
          totalPages={returns.totalPages}
          onPageChange={returns.setPage}
        />
      ) : null}
    </RequirePermission>
  );
}
