"use client";

import { useCallback } from "react";
import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable.component";
import { useVendorApprovalTableColumns } from "./useVendorApprovalTableColumns.hook";
import { VendorApprovalRowActions } from "./VendorApprovalRowActions.component";

interface Vendor {
  id: string;
  businessName: string;
  slug: string;
  kycComplete?: boolean;
}

export interface VendorApprovalTableProps {
  vendors: Vendor[];
  onApprove: (id: string, commissionRate?: number) => void | Promise<unknown>;
  onReject: (id: string, reason: string) => void | Promise<unknown>;
  isApproving?: boolean;
  isRejecting?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  pagination?: DataTablePaginationProps;
}

export function VendorApprovalTable({
  vendors,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  loading = false,
  onRefresh,
  pagination,
}: VendorApprovalTableProps) {
  const columns = useVendorApprovalTableColumns();
  const rowBusy = isApproving || isRejecting;

  const getRowId = useCallback((row: Vendor) => row.id, []);

  const renderActions = useCallback(
    (v: Vendor) => (
      <VendorApprovalRowActions
        vendor={v}
        rowBusy={rowBusy}
        onApprove={onApprove}
        onReject={onReject}
        onRefresh={onRefresh}
      />
    ),
    [rowBusy, onApprove, onReject, onRefresh],
  );

  return (
    <DataTable
      columns={columns}
      rows={vendors}
      loading={loading}
      onRefresh={onRefresh}
      getRowId={getRowId}
      pagination={pagination}
      actions={renderActions}
    />
  );
}
