import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatInr } from "@/shared/utils/orderFormat";
import type { PayoutEntry } from "@/shared/api/types";

interface PayoutsTableProps {
  payouts?: { items?: PayoutEntry[] };
}

function formatPayoutPeriod(payout: PayoutEntry): string {
  const start = new Date(payout.periodStart).toLocaleDateString();
  const end = new Date(payout.periodEnd).toLocaleDateString();
  return `${start} – ${end}`;
}

function formatPayoutDetails(payout: PayoutEntry): string {
  if (payout.status === "PAID" && payout.paymentReferenceNumber) {
    const method = payout.paymentMethod ?? "Transfer";
    return `${method} · ${payout.paymentReferenceNumber}`;
  }
  if (payout.status === "FAILED" && payout.failureReason) {
    return payout.failureReason;
  }
  return "—";
}

export function PayoutsTable({ payouts }: PayoutsTableProps) {
  const items = payouts?.items ?? [];
  const isEmpty = items.length === 0;

  const rows = items.map((payout) => ({
    id: payout.id,
    status: payout.status,
    periodLabel: formatPayoutPeriod(payout),
    amountLabel: formatInr(payout.amount),
    detailsLabel: formatPayoutDetails(payout),
  }));

  const mobileEmptyState = (
    <li className="rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted">
      {LABELS.noPayoutsYet}
    </li>
  );

  const mobileRows = rows.map((row) => (
    <li
      key={row.id}
      className="rounded-md border border-line bg-surface p-4 shadow-card-hairline"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.875rem] text-ink">{row.periodLabel}</p>
        <StatusBadge status={row.status} />
      </div>
      <p className="mt-2 font-mono text-[1rem] text-ink">{row.amountLabel}</p>
      <p className="mt-2 text-body-sm text-ink-muted">{row.detailsLabel}</p>
    </li>
  ));

  const mobileContent = isEmpty ? mobileEmptyState : mobileRows;

  const desktopEmptyState = (
    <TableRow>
      <TableCell colSpan={4} className="text-center text-ink-muted">
        {LABELS.noPayoutsYet}
      </TableCell>
    </TableRow>
  );

  const desktopRows = rows.map((row) => (
    <TableRow key={row.id}>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "text-body")}>
        {row.periodLabel}
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        {row.amountLabel}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <StatusBadge status={row.status} />
      </TableCell>
      <TableCell
        className={cn(TABLE_DATA_CELL_CLASS, "text-body-sm text-ink-muted")}
      >
        {row.detailsLabel}
      </TableCell>
    </TableRow>
  ));

  const desktopContent = isEmpty ? desktopEmptyState : desktopRows;

  return (
    <div>
      <h2 className="mb-4 text-[1.375rem] font-semibold text-ink">
        {LABELS.payouts}
      </h2>

      <ul className="space-y-3 lg:hidden">{mobileContent}</ul>

      <TableScrollShell desktopOnly>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.period}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.amount}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                {LABELS.status}
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                Payment details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{desktopContent}</TableBody>
        </Table>
      </TableScrollShell>
    </div>
  );
}
