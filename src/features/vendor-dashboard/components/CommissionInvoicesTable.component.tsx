"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatInr } from "@/shared/utils/orderFormat";
import {
  commissionsApi,
  type CommissionInvoiceEntry,
} from "@/features/admin-dashboard";

interface CommissionInvoicesTableProps {
  invoices: CommissionInvoiceEntry[];
}

export function CommissionInvoicesTable({
  invoices,
}: CommissionInvoicesTableProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const download = async (id: string) => {
    setPendingId(id);
    try {
      await commissionsApi.downloadInvoice(id);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-[1.375rem] font-semibold text-ink">
        {LABELS.commissionInvoices}
      </h2>

      <ul className="space-y-3 lg:hidden">
        {invoices.length === 0 ? (
          <li className="rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted">
            {LABELS.noCommissionInvoicesYet}
          </li>
        ) : (
          invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="rounded-md border border-line bg-surface p-4 shadow-card-hairline"
            >
              <p className="font-mono text-[0.875rem] text-ink">
                {invoice.number}
              </p>
              <p className="mt-1 text-[0.875rem] text-ink-muted">
                {new Date(invoice.issuedAt).toLocaleDateString()}
              </p>
              <p className="mt-2 font-mono text-[1rem] text-ink">
                {formatInr(invoice.totalAmount)}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                loading={pendingId === invoice.id}
                onClick={() => void download(invoice.id)}
              >
                {LABELS.downloadCommissionInvoice}
              </Button>
            </li>
          ))
        )}
      </ul>

      <TableScrollShell desktopOnly>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Invoice</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.amount}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.issuedAt}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-ink-muted">
                  {LABELS.noCommissionInvoicesYet}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
                    {invoice.number}
                  </TableCell>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
                    {formatInr(invoice.totalAmount)}
                  </TableCell>
                  <TableCell className={TABLE_DATA_CELL_CLASS}>
                    {new Date(invoice.issuedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={TABLE_DATA_CELL_CLASS}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      loading={pendingId === invoice.id}
                      onClick={() => void download(invoice.id)}
                    >
                      {LABELS.downloadCommissionInvoice}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableScrollShell>
    </div>
  );
}
