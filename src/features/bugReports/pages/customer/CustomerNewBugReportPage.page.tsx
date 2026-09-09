"use client";

import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { SupportAuthGate } from "@/features/supportTickets";
import { BugReportForm } from "../../components/form/BugReportForm.component";
import { bugReportsPagesStyles } from "./bugReportsPages.styles";

export function CustomerNewBugReportPage() {
  return (
    <SupportAuthGate
      message={LABELS.bugSignInRequired}
      loginNext={PATHS.bugReportNew}
    >
      <div className={bugReportsPagesStyles.customerNewBugContainer}>
        <BugReportForm successHref={PATHS.bugReport} />
      </div>
    </SupportAuthGate>
  );
}
