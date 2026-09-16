"use client";

import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { useVendorLowStockWidget } from "../../hooks/products/useVendorLowStockWidget.hook";
import type { LowStockInventoryRow } from "../../api/overview/vendor.api";
import {
  LOW_STOCK_AT_CELL,
  LOW_STOCK_CONTENT,
  LOW_STOCK_COUNT_DANGER,
  LOW_STOCK_COUNT_WARNING,
  LOW_STOCK_EMPTY,
  LOW_STOCK_HEADER,
  LOW_STOCK_ICON,
  LOW_STOCK_LOADING_STACK,
  LOW_STOCK_NAME_CELL,
  LOW_STOCK_REMAINING_NOTICE,
  LOW_STOCK_SKELETON,
  LOW_STOCK_SKU_CELL,
  LOW_STOCK_TITLE,
} from "../../styles/products/vendorLowStockWidget.styles";

const COLUMNS: DataTableColumn<LowStockInventoryRow>[] = [
  {
    id: "productName",
    header: LABELS.productName,
    className: LOW_STOCK_NAME_CELL,
    accessor: "productName",
  },
  {
    id: "sku",
    header: LABELS.sku,
    className: LOW_STOCK_SKU_CELL,
    accessor: "sku",
  },
  {
    id: "stock",
    header: LABELS.stock,
    cell: (row) => (
      <span
        className={
          row.stock <= 0 ? LOW_STOCK_COUNT_DANGER : LOW_STOCK_COUNT_WARNING
        }
      >
        {row.stock}
      </span>
    ),
  },
  {
    id: "lowStockAt",
    header: LABELS.lowStockAt,
    className: LOW_STOCK_AT_CELL,
    accessor: "lowStockAt",
  },
];

export function VendorLowStockWidget() {
  const { visible, remaining, isEmpty, hasRemaining, isLoading } =
    useVendorLowStockWidget();

  const loadingState = (
    <div className={LOW_STOCK_LOADING_STACK}>
      <Skeleton className={LOW_STOCK_SKELETON} />
      <Skeleton className={LOW_STOCK_SKELETON} />
      <Skeleton className={LOW_STOCK_SKELETON} />
    </div>
  );

  const emptyState = (
    <p className={LOW_STOCK_EMPTY}>
      {vendorDashboardWidgetsLabels.vendorLowStockEmpty}
    </p>
  );

  const remainingNotice = hasRemaining ? (
    <p className={LOW_STOCK_REMAINING_NOTICE}>
      +{remaining} {vendorDashboardWidgetsLabels.vendorLowStockMoreItemsSuffix}
    </p>
  ) : null;

  const tableState = (
    <>
      <DataTable
        columns={COLUMNS}
        rows={visible}
        getRowId={(row) => row.id}
        rowDetails={false}
      />
      {remainingNotice}
    </>
  );

  const content = isLoading ? loadingState : isEmpty ? emptyState : tableState;

  return (
    <Card>
      <CardHeader className={LOW_STOCK_HEADER}>
        <CardTitle className={LOW_STOCK_TITLE}>
          <AlertTriangle className={LOW_STOCK_ICON} aria-hidden="true" />
          {vendorDashboardWidgetsLabels.vendorLowStockTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className={LOW_STOCK_CONTENT}>{content}</CardContent>
    </Card>
  );
}
