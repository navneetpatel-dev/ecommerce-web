"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { VendorAnalyticsPanel } from "../components/VendorAnalyticsPanel.component";

export function VendorAnalyticsPage() {
  return (
    <RequirePermission permission={[PERMISSIONS.PAYOUT_VIEW]}>
      <div className="space-y-6">
        <h1 className="text-[1.375rem] font-semibold text-ink">
          {vendorDashboardWidgetsLabels.vendorAnalyticsTitle}
        </h1>
        <VendorAnalyticsPanel />
      </div>
    </RequirePermission>
  );
}
