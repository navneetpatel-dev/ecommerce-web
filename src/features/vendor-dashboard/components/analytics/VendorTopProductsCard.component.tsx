"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { LABELS } from "@/shared/constants/labels";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { type TopProduct } from "./VendorAnalyticsPanel/TopProductsRows.component";
import {
  TOP_PRODUCTS_CARD,
  TOP_PRODUCTS_CONTENT,
  TOP_PRODUCTS_EMPTY,
  TOP_PRODUCTS_HEADER,
  TOP_PRODUCTS_NAME_CELL,
  TOP_PRODUCTS_NUMERIC_CELL,
  TOP_PRODUCTS_TITLE,
} from "../../styles/analytics/vendorAnalyticsPanel.styles";

export type { TopProduct };

export interface VendorTopProductsCardProps {
  topProducts: TopProduct[];
}

const COLUMNS: DataTableColumn<TopProduct>[] = [
  {
    id: "name",
    header: LABELS.productName,
    className: TOP_PRODUCTS_NAME_CELL,
    accessor: "name",
  },
  {
    id: "unitsSold",
    header: vendorDashboardWidgetsLabels.vendorAnalyticsUnitsSold,
    className: TOP_PRODUCTS_NUMERIC_CELL,
    accessor: "unitsSold",
  },
  {
    id: "revenue",
    header: LABELS.revenue,
    className: TOP_PRODUCTS_NUMERIC_CELL,
    cell: (row) => formatInr(row.revenue),
  },
];

/** Ranked top-products table for the vendor analytics dashboard. */
export function VendorTopProductsCard({
  topProducts,
}: VendorTopProductsCardProps) {
  const isEmpty = topProducts.length === 0;

  return (
    <Card className={TOP_PRODUCTS_CARD}>
      <CardHeader className={TOP_PRODUCTS_HEADER}>
        <CardTitle className={TOP_PRODUCTS_TITLE}>
          {vendorDashboardWidgetsLabels.vendorAnalyticsTopProducts}
        </CardTitle>
        <CardDescription>
          {vendorDashboardWidgetsLabels.vendorAnalyticsTopProductsHint}
        </CardDescription>
      </CardHeader>
      <CardContent className={TOP_PRODUCTS_CONTENT}>
        {isEmpty ? (
          <p className={TOP_PRODUCTS_EMPTY}>
            {vendorDashboardWidgetsLabels.vendorAnalyticsEmptyProducts}
          </p>
        ) : (
          <DataTable
            columns={COLUMNS}
            rows={topProducts}
            getRowId={(row) => row.id}
            rowDetails={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
