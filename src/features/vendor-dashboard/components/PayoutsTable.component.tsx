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

export function PayoutsTable({ payouts }: PayoutsTableProps) {
  const items = payouts?.items ?? [];

  return (
    <div>
      <h2 className="mb-4 text-[1.375rem] font-semibold text-ink">
        {LABELS.payouts}
      </h2>

      <ul className="space-y-3 lg:hidden">
        {items.length === 0 ? (
          <li className="rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted">
            {LABELS.noPayoutsYet}
          </li>
        ) : (
          items.map((payout) => (
            <li
              key={payout.id}
              className="rounded-md border border-line bg-surface p-4 shadow-card-hairline"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.875rem] text-ink">
                  {new Date(payout.periodStart).toLocaleDateString()} –{" "}
                  {new Date(payout.periodEnd).toLocaleDateString()}
                </p>
                <StatusBadge status={payout.status} />
              </div>
              <p className="mt-2 font-mono text-[1rem] text-ink">
                {formatInr(payout.amount)}
              </p>
            </li>
          ))
        )}
      </ul>

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-ink-muted">
                  {LABELS.noPayoutsYet}
                </TableCell>
              </TableRow>
            ) : (
              items.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "text-body")}>
                    {new Date(payout.periodStart).toLocaleDateString()} –{" "}
                    {new Date(payout.periodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
                    {formatInr(payout.amount)}
                  </TableCell>
                  <TableCell className={TABLE_DATA_CELL_CLASS}>
                    <StatusBadge status={payout.status} />
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
