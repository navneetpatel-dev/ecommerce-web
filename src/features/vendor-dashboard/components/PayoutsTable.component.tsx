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
import { cn } from "@/shared/utils/cn";

interface Payout {
  id: string;
  periodStart: string;
  periodEnd: string;
  amount: number;
  status: string;
}

interface PayoutsTableProps {
  payouts?: { items?: Payout[] };
}

export function PayoutsTable({ payouts }: PayoutsTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-[1.375rem] font-semibold text-ink">Payouts</h2>

      {/* Mobile: stacked cards */}
      <ul className="space-y-3 lg:hidden">
        {payouts?.items?.length === 0 ? (
          <li className="rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted">
            No payouts yet
          </li>
        ) : (
          payouts?.items?.map((p) => (
            <li
              key={p.id}
              className="rounded-md border border-line bg-surface p-4 shadow-card-hairline"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.875rem] text-ink">
                  {new Date(p.periodStart).toLocaleDateString()} –{" "}
                  {new Date(p.periodEnd).toLocaleDateString()}
                </p>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-2 font-mono text-[1rem] text-ink">₹{p.amount}</p>
            </li>
          ))
        )}
      </ul>

      {/* lg+: scrollable table */}
      <TableScrollShell desktopOnly>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Period</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Amount</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-ink-muted">
                  No payouts yet
                </TableCell>
              </TableRow>
            ) : (
              payouts?.items?.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "text-body")}>
                    {new Date(p.periodStart).toLocaleDateString()} –{" "}
                    {new Date(p.periodEnd).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
                    ₹{p.amount}
                  </TableCell>
                  <TableCell className={TABLE_DATA_CELL_CLASS}>
                    <StatusBadge status={p.status} />
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
