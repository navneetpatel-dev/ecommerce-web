"use client";

import { useCallback, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { commissionsApi, payoutsApi } from "../api/finance.api";
import { AdminConfirmAction } from "../components/AdminConfirmAction.component";
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
    (_row: AdminDataRow, reload: () => void): ReactNode => (
      <AdminConfirmAction
        label={LABELS.processPayouts}
        dialogVariant="warning"
        tone="success"
        title={LABELS.confirmProcessPayoutsTitle}
        description={LABELS.confirmProcessPayoutsBody}
        onConfirm={() => payoutsApi.process().then(reload)}
      />
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
        "createdAt",
      ],
    },
  };
}
