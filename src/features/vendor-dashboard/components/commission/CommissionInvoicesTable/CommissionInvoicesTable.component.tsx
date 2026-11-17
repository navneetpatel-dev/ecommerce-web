"use client";

import { useState, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Table } from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/DataTable/TableScrollShell.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { CollapsibleTableFilters } from "@/shared/components/filters";
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

  const activeCount = search.trim() ? 1 : 0;
  const handleClear = () => setSearch("");

  return (
    <div className={styles.container}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
        <h2 className={styles.heading}>{LABELS.commissionInvoices}</h2>
      </div>

      {invoiceViewModels.length > 0 && (
        <CollapsibleTableFilters
          activeCount={activeCount}
          onClear={handleClear}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
            <FormFieldFrame
              label={LABELS.search}
              htmlFor="commission-invoices-search"
            >
              <Input
                id="commission-invoices-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by invoice # or period..."
              />
            </FormFieldFrame>
          </div>
        </CollapsibleTableFilters>
      )}

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
