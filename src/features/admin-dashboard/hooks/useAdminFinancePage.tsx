"use client";

import { useCallback, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { commissionsApi, payoutsApi } from "../api/finance.api";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
import { AdminMarkPayoutPaidAction } from "../components/AdminMarkPayoutPaidAction.component";
import type { AdminDataRow } from "./useAdminDataList.hook";
import type { AdminListPageModel } from "../types/adminListPage.types";

export type AdminFinancePageModel = {
  commissions: AdminListPageModel;
  commissionInvoices: AdminListPageModel;
  payouts: AdminListPageModel;
};

export function useAdminFinancePage(): AdminFinancePageModel {
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
          <div className="flex flex-wrap justify-end gap-2">
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
      actions: (row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void commissionsApi.downloadInvoice(String(row.id))}
        >
          {LABELS.downloadCommissionInvoice}
        </Button>
      ),
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
  };
}
