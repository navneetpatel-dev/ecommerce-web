"use client";

import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import { LABELS } from "@/shared/constants/labels";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { useVendorLowStockWidget } from "./VendorLowStockWidget/useVendorLowStockWidget.hook";
import { LowStockRows } from "./VendorLowStockWidget/LowStockRows.component";
import {
  LOW_STOCK_CONTENT,
  LOW_STOCK_EMPTY,
  LOW_STOCK_HEADER,
  LOW_STOCK_LOADING_STACK,
  LOW_STOCK_REMAINING_NOTICE,
  LOW_STOCK_TITLE,
} from "./VendorLowStockWidget/vendorLowStockWidget.styles";

export function VendorLowStockWidget() {
  const { visible, remaining, isEmpty, hasRemaining, isLoading } =
    useVendorLowStockWidget();

  const loadingState = (
    <div className={LOW_STOCK_LOADING_STACK}>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
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
      <TableScrollShell>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.productName}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.sku}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.stock}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.lowStockAt}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <LowStockRows rows={visible} />
          </TableBody>
        </Table>
      </TableScrollShell>
      {remainingNotice}
    </>
  );

  const content = isLoading ? loadingState : isEmpty ? emptyState : tableState;

  return (
    <Card>
      <CardHeader className={LOW_STOCK_HEADER}>
        <CardTitle className={LOW_STOCK_TITLE}>
          <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
          {vendorDashboardWidgetsLabels.vendorLowStockTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className={LOW_STOCK_CONTENT}>{content}</CardContent>
    </Card>
  );
}
