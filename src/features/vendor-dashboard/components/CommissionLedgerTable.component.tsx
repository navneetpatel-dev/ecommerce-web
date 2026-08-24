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

interface Commission {
  id: string;
  createdAt: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
}

interface CommissionLedgerTableProps {
  commissions?: { items?: Commission[] };
}

export function CommissionLedgerTable({
  commissions,
}: CommissionLedgerTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-[1.375rem] font-semibold text-ink">
        Commission Ledger
      </h2>

      <ul className="space-y-3 lg:hidden">
        {commissions?.items?.length === 0 ? (
          <li className="rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted">
            No entries yet
          </li>
        ) : (
          commissions?.items?.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-line bg-surface p-4 shadow-card-hairline"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.875rem] text-ink">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
                <StatusBadge status={c.status} />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.875rem]">
                <div>
                  <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
                    Sale
                  </dt>
                  <dd className="font-mono text-ink">₹{c.saleAmount}</dd>
                </div>
                <div>
                  <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
                    Rate
                  </dt>
                  <dd className="text-ink">{c.commissionRate}%</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
                    Commission
                  </dt>
                  <dd className="font-mono text-ink">₹{c.commissionAmount}</dd>
                </div>
              </dl>
            </li>
          ))
        )}
      </ul>

      <TableScrollShell desktopOnly>
        <Table scrollContainer={false}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Date</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                Sale Amount
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Rate</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                Commission
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions?.items?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-ink-muted">
                  No entries yet
                </TableCell>
              </TableRow>
            ) : (
              commissions?.items?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "text-body")}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
                    ₹{c.saleAmount}
                  </TableCell>
                  <TableCell className={TABLE_DATA_CELL_CLASS}>
                    {c.commissionRate}%
                  </TableCell>
                  <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
                    ₹{c.commissionAmount}
                  </TableCell>
                  <TableCell className={TABLE_DATA_CELL_CLASS}>
                    <StatusBadge status={c.status} />
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
