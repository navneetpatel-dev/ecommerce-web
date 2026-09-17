"use client";

import { useCallback, useState, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { commissionsApi, payoutsApi } from "../../api/finance/finance.api";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminMarkPayoutPaidAction } from "../../components/finance/AdminMarkPayoutPaidAction.component";
import { AdminCommissionInvoiceDownloadAction } from "../../components/finance/AdminCommissionInvoiceDownloadAction.component";
import { adminDataListViewStyles } from "../../styles/shared/adminDataListView.styles";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { AdminListPageModel } from "../../types/shared/adminListPage.types";

export type AdminFinancePageModel = {
  commissions: AdminListPageModel;
  commissionInvoices: AdminListPageModel;
  payouts: AdminListPageModel;
  payoutRevision: number;
  processPayouts: () => Promise<unknown>;
};

export function useAdminFinancePage(): AdminFinancePageModel {
  const [payoutRevision, setPayoutRevision] = useState(0);
  const loadCommissions = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      commissionsApi.list({ page, limit }),
    [],
  );
  const loadCommissionInvoices = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      commissionsApi.listInvoices({ page, limit }),
    [],
  );
  const loadPayouts = useCallback(
    ({ page, limit }: { page: number; limit: number }) =>
      payoutsApi.list({ page, limit }),
    [],
  );

  const payoutActions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const status = String(row.status);
      if (status === "PENDING") {
        return (
          <div className={adminDataListViewStyles.rowActionsEndWrap}>
            <AdminMarkPayoutPaidAction
              payoutId={String(row.id)}
              onDone={reload}
            />
            <AdminConfirmAction
              label="Mark failed"
              dialogVariant="danger"
              tone="danger"
              title="Mark payout as failed?"
              description="Record why the external transfer could not be completed."
              requireReason
              onConfirm={(reason) =>
                payoutsApi.markFailed(String(row.id), reason ?? "").then(reload)
              }
            />
          </div>
        );
      }
      if (status === "FAILED" && row.preparedAt) {
        return (
          <AdminConfirmAction
            label="Retry payout"
            dialogVariant="warning"
            tone="success"
            title="Retry this payout?"
            description="Return this payout to pending after arranging another transfer attempt."
            onConfirm={() => payoutsApi.retry(String(row.id)).then(reload)}
          />
        );
      }
      return null;
    },
    [],
  );

  const processPayouts = useCallback(
    () =>
      payoutsApi.process().then(() => setPayoutRevision((value) => value + 1)),
    [],
  );

  const invoiceActions = useCallback(
    (row: AdminDataRow): ReactNode => (
      <AdminCommissionInvoiceDownloadAction invoiceId={String(row.id)} />
    ),
    [],
  );

  return {
    commissions: {
      title: LABELS.commissions,
      permission: PERMISSIONS.COMMISSION_VIEW,
      load: loadCommissions,
      columnKeys: [
        "vendorName",
        "saleAmount",
        "commissionRate",
        "commissionAmount",
        "status",
        "createdAt",
      ],
    },
    commissionInvoices: {
      title: LABELS.commissionInvoices,
      permission: PERMISSIONS.COMMISSION_VIEW,
      load: loadCommissionInvoices,
      actions: invoiceActions,
      columnKeys: [
        "number",
        "vendorName",
        "taxableAmount",
        "gstAmount",
        "totalAmount",
        "issuedAt",
      ],
    },
    payouts: {
      title: LABELS.payouts,
      permission: PERMISSIONS.PAYOUT_MANAGE,
      load: loadPayouts,
      actions: payoutActions,
      columnKeys: [
        "vendorName",
        "amount",
        "periodStart",
        "periodEnd",
        "status",
        "paymentMethod",
        "paymentReferenceNumber",
        "paidAt",
        "failureReason",
        "createdAt",
      ],
    },
    payoutRevision,
    processPayouts,
  };
}
