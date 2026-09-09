"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { VendorAnalyticsPanel } from "../components/VendorAnalyticsPanel.component";
import { vendorPagesStyles } from "./vendorPages.styles";

export function VendorAnalyticsPage() {
  return (
    <RequirePermission permission={[PERMISSIONS.PAYOUT_VIEW]}>
      <div className={vendorPagesStyles.stackMd}>
        <h1 className={vendorPagesStyles.pageHeading}>
          {vendorDashboardWidgetsLabels.vendorAnalyticsTitle}
        </h1>
        <VendorAnalyticsPanel />
      </div>
    </RequirePermission>
  );
}
