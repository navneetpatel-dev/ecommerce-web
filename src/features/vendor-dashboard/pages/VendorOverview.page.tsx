"use client";

import { useVendorOverview } from "../hooks/useVendorOverview.hook";
import { ProductsTable } from "./ProductsTable.page";
import { VendorSummaryGrid } from "../components/VendorSummaryGrid.component";
import { VendorLowStockWidget } from "../components/VendorLowStockWidget.component";
import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_NAV } from "@/shared/constants/vendorNav";

export function VendorOverview() {
  const overview = useVendorOverview();

  if (overview.isLoading) return <SkeletonGrid count={4} aspect="h-24" />;

  return (
    <RequirePermission permission={VENDOR_NAV[0].permissions}>
      <div className="space-y-8">
        <VendorSummaryGrid summary={overview.summary} />
        <VendorLowStockWidget />
        <ProductsTable />
      </div>
    </RequirePermission>
  );
}
