"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions";
import { PATHS } from "@/shared/constants/paths";
import { BugReportForm } from "../components/BugReportForm.component";

export function VendorNewBugReportPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <div className="w-full min-w-0">
        <BugReportForm successHref={PATHS.vendor.bugReport} />
      </div>
    </RequirePermission>
  );
}
