"use client";

import { Table } from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
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

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{LABELS.commissionInvoices}</h2>

      <CommissionInvoicesMobileList
        invoices={invoiceViewModels}
        onDownload={handleDownload}
      />

      <TableScrollShell desktopOnly>
        <Table scrollContainer={false}>
          <CommissionInvoicesTableHeader />
          <CommissionInvoicesTableBody
            invoices={invoiceViewModels}
            onDownload={handleDownload}
          />
        </Table>
      </TableScrollShell>
    </div>
  );
}
