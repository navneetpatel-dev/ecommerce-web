"use client";

import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { SupportAuthGate } from "@/features/supportTickets";
import { BugReportForm } from "../components/BugReportForm.component";

export function CustomerNewBugReportPage() {
  return (
    <SupportAuthGate
      message={LABELS.bugSignInRequired}
      loginNext={PATHS.bugReportNew}
    >
      <div className="storefront-container py-8 md:py-10">
        <BugReportForm successHref={PATHS.bugReport} />
      </div>
    </SupportAuthGate>
  );
}
