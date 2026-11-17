"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Table } from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import type { CommissionInvoiceEntry } from "@/features/admin-dashboard";
import { useCommissionInvoices } from "../../../hooks/commission/useCommissionInvoices.hook";
import { commissionInvoicesTableStyles as styles } from "../../../styles/commission/commissionInvoicesTable.styles";
import { CommissionInvoicesMobileList } from "./CommissionInvoicesMobileList.component";
import { CommissionInvoicesTableHeader } from "./CommissionInvoicesTableHeader.component";
import { CommissionInvoicesTableBody } from "./CommissionInvoicesTableBody.component";

interface CommissionInvoicesTableProps {
  invoices: CommissionInvoiceEntry[];
}

export function CommissionInvoicesTable({
  invoices,
}: CommissionInvoicesTableProps) {
  const { invoiceViewModels, handleDownload } = useCommissionInvoices(invoices);
  const [search, setSearch] = useState("");

  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoiceViewModels;
    const q = search.trim().toLowerCase();
    return invoiceViewModels.filter(
      (inv) =>
        inv.number?.toLowerCase().includes(q) ||
        inv.formattedDate?.toLowerCase().includes(q) ||
        inv.formattedAmount?.toLowerCase().includes(q),
    );
  }, [invoiceViewModels, search]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h2 className={styles.heading}>{LABELS.commissionInvoices}</h2>
        {invoiceViewModels.length > 0 && (
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice # or period..."
              className="pl-8 h-8 text-xs"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSearch("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-1.5 text-xs text-text-muted"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      <CommissionInvoicesMobileList
        invoices={filteredInvoices}
        onDownload={handleDownload}
      />

      <TableScrollShell desktopOnly>
        <Table scrollContainer={false}>
          <CommissionInvoicesTableHeader />
          <CommissionInvoicesTableBody
            invoices={filteredInvoices}
            onDownload={handleDownload}
          />
        </Table>
      </TableScrollShell>
    </div>
  );
}
