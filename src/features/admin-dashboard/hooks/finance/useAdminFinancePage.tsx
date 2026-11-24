"use client";

import { useCallback, useState, type ReactNode } from "react";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { commissionsApi, payoutsApi } from "../../api/finance/finance.api";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminMarkPayoutPaidAction } from "../../components/finance/AdminMarkPayoutPaidAction.component";
import { AdminCommissionInvoiceDownloadAction } from "../../components/finance/AdminCommissionInvoiceDownloadAction.component";
import {
  ADMIN_COMMISSION_COLUMN_KEYS,
  ADMIN_COMMISSION_INVOICE_COLUMN_KEYS,
  ADMIN_PAYOUT_COLUMN_KEYS,
} from "../../constants/finance/adminFinanceColumns.constants";
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
      const markPayoutFailed = (reason?: string) =>
        payoutsApi.markFailed(String(row.id), reason ?? "").then(reload);
      const retryPayout = () => payoutsApi.retry(String(row.id)).then(reload);
      if (status === "PENDING") {
        return (
          <>
            <AdminMarkPayoutPaidAction
              payoutId={String(row.id)}
              bankDetails={
                row.bankDetails as Parameters<
                  typeof AdminMarkPayoutPaidAction
                >[0]["bankDetails"]
              }
              onDone={reload}
            />
            <AdminConfirmAction
              label={LABELS.markPayoutFailed}
              dialogVariant="danger"
              tone="danger"
              title={LABELS.confirmMarkPayoutFailedTitle}
              description={LABELS.confirmMarkPayoutFailedBody}
              requireReason
              onConfirm={markPayoutFailed}
            />
          </>
        );
      }
      if (status === "FAILED" && row.preparedAt) {
        return (
          <AdminConfirmAction
            label={LABELS.retryPayout}
            dialogVariant="warning"
            tone="success"
            title={LABELS.confirmRetryPayoutTitle}
            description={LABELS.confirmRetryPayoutBody}
            onConfirm={retryPayout}
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
      columnKeys: [...ADMIN_COMMISSION_COLUMN_KEYS],
    },
    commissionInvoices: {
      title: LABELS.commissionInvoices,
      permission: PERMISSIONS.COMMISSION_VIEW,
      load: loadCommissionInvoices,
      actions: invoiceActions,
      columnKeys: [...ADMIN_COMMISSION_INVOICE_COLUMN_KEYS],
    },
    payouts: {
      title: LABELS.payouts,
      permission: PERMISSIONS.PAYOUT_MANAGE,
      load: loadPayouts,
      actions: payoutActions,
      columnKeys: [...ADMIN_PAYOUT_COLUMN_KEYS],
    },
    payoutRevision,
    processPayouts,
  };
}
