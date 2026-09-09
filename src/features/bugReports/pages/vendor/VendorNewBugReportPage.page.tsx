"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions/permissions";
import { PATHS } from "@/shared/constants/paths/paths";
import { BugReportForm } from "../../components/form/BugReportForm.component";
import { bugReportsPagesStyles } from "../customer/bugReportsPages.styles";

export function VendorNewBugReportPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <div className={bugReportsPagesStyles.vendorNewBugContainer}>
        <BugReportForm successHref={PATHS.vendor.bugReport} />
      </div>
    </RequirePermission>
  );
}
