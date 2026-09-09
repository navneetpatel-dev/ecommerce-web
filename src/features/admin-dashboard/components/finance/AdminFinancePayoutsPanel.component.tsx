"use client";

import { AdminDataPage } from "../../pages/shared/AdminDataPage.page";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { LABELS } from "@/shared/constants/labels";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";
import { adminFinancePageStyles } from "../../pages/finance/adminFinancePage.styles";

interface AdminFinancePayoutsPanelProps {
  payouts: AdminListPageModel;
  payoutRevision: number;
  onProcessPayouts: () => Promise<unknown>;
}

export function AdminFinancePayoutsPanel({
  payouts,
  payoutRevision,
  onProcessPayouts,
}: AdminFinancePayoutsPanelProps) {
  return (
    <div className={adminFinancePageStyles.payoutsStack}>
      <div className={adminFinancePageStyles.payoutsActionRow}>
        <AdminConfirmAction
          label={LABELS.processPayouts}
          dialogVariant="warning"
          tone="success"
          title={LABELS.confirmProcessPayoutsTitle}
          description={LABELS.confirmProcessPayoutsBody}
          onConfirm={onProcessPayouts}
        />
      </div>
      <AdminDataPage
        key={payoutRevision}
        title={payouts.title}
        permission={payouts.permission}
        load={payouts.load}
        actions={payouts.actions}
        columnKeys={payouts.columnKeys}
        hideTitle
      />
    </div>
  );
}
