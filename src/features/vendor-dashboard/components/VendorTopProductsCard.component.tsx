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
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import { LABELS } from "@/shared/constants/labels";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { formatInr } from "@/shared/utils/orderFormat";
import { cn } from "@/shared/utils/cn";

interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

interface VendorTopProductsCardProps {
  topProducts: TopProduct[];
}

/** Ranked top-products table for the vendor analytics dashboard. */
export function VendorTopProductsCard({
  topProducts,
}: VendorTopProductsCardProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-body-lg">
          {vendorDashboardWidgetsLabels.vendorAnalyticsTopProducts}
        </CardTitle>
        <CardDescription>
          {vendorDashboardWidgetsLabels.vendorAnalyticsTopProductsHint}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {topProducts.length === 0 ? (
          <p className="py-10 text-center text-body-sm text-ink-muted">
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
                {topProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell
                      className={cn(TABLE_DATA_CELL_CLASS, "text-body")}
                    >
                      {product.name}
                    </TableCell>
                    <TableCell
                      className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}
                    >
                      {product.unitsSold}
                    </TableCell>
                    <TableCell
                      className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}
                    >
                      {formatInr(product.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollShell>
        )}
      </CardContent>
    </Card>
  );
}
