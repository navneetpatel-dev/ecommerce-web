"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table/table";
import { LABELS } from "@/shared/constants/labels";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import {
  TopProductsRows,
  type TopProduct,
} from "./VendorAnalyticsPanel/TopProductsRows.component";
import {
  TOP_PRODUCTS_CARD,
  TOP_PRODUCTS_CONTENT,
  TOP_PRODUCTS_EMPTY,
  TOP_PRODUCTS_HEADER,
  TOP_PRODUCTS_TITLE,
} from "../../styles/analytics/vendorAnalyticsPanel.styles";

export type { TopProduct };

export interface VendorTopProductsCardProps {
  topProducts: TopProduct[];
}

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
          <TableScrollShell>
            <Table scrollContainer={false}>
              <TableHeader>
                <TableRow>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.productName}
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {vendorDashboardWidgetsLabels.vendorAnalyticsUnitsSold}
                  </TableHead>
                  <TableHead className={TABLE_DATA_CELL_CLASS}>
                    {LABELS.revenue}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TopProductsRows topProducts={topProducts} />
              </TableBody>
            </Table>
          </TableScrollShell>
        )}
      </CardContent>
    </Card>
  );
}
