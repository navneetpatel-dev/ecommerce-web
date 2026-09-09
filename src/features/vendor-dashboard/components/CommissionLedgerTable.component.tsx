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
import { formatInr } from "@/shared/utils/orderFormat";

interface Commission {
  id: string;
  createdAt: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: string;
  tdsAmount?: number | null;
  tdsRatePercent?: number | null;
  gstAmount?: number | null;
}

interface CommissionLedgerTableProps {
  commissions?: { items?: Commission[] };
}

function formatTdsRate(rate?: number | null) {
  return rate == null ? "—" : `${rate}%`;
}

function formatOrDash(amount?: number | null) {
  return amount == null ? "—" : formatInr(amount);
}

export function CommissionLedgerTable({
  commissions,
}: CommissionLedgerTableProps) {
  const items = commissions?.items ?? [];
  const isEmpty = items.length === 0;

  const rows = items.map((c) => ({
    id: c.id,
    status: c.status,
    dateLabel: new Date(c.createdAt).toLocaleDateString(),
    saleAmountLabel: formatInr(c.saleAmount),
    rateLabel: `${c.commissionRate}%`,
    commissionAmountLabel: formatInr(c.commissionAmount),
    gstAmountLabel: formatOrDash(c.gstAmount),
    tdsAmountLabel: formatOrDash(c.tdsAmount),
    tdsRateLabel: formatTdsRate(c.tdsRatePercent),
  }));

  const mobileEmptyState = (
    <li className="rounded-md border border-line bg-surface px-4 py-10 text-center text-ink-muted">
      No entries yet
    </li>
  );

  const mobileRows = rows.map((row) => (
    <li
      key={row.id}
      className="rounded-md border border-line bg-surface p-4 shadow-card-hairline"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.875rem] text-ink">{row.dateLabel}</p>
        <StatusBadge status={row.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.875rem]">
        <div>
          <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
            Sale
          </dt>
          <dd className="font-mono text-ink">{row.saleAmountLabel}</dd>
        </div>
        <div>
          <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
            Rate
          </dt>
          <dd className="text-ink">{row.rateLabel}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
            Commission
          </dt>
          <dd className="font-mono text-ink">{row.commissionAmountLabel}</dd>
        </div>
        <div>
          <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
            GST
          </dt>
          <dd className="font-mono text-ink">{row.gstAmountLabel}</dd>
        </div>
        <div>
          <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">
            TDS
          </dt>
          <dd className="font-mono text-ink">
            {row.tdsAmountLabel}{" "}
            <span className="text-ink-muted">({row.tdsRateLabel})</span>
          </dd>
        </div>
      </dl>
    </li>
  ));

  const mobileContent = isEmpty ? mobileEmptyState : mobileRows;

  const desktopEmptyState = (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-ink-muted">
        No entries yet
      </TableCell>
    </TableRow>
  );

  const desktopRows = rows.map((row) => (
    <TableRow key={row.id}>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "text-body")}>
        {row.dateLabel}
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        {row.saleAmountLabel}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>{row.rateLabel}</TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        {row.commissionAmountLabel}
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        {row.gstAmountLabel}
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        {row.tdsAmountLabel}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        {row.tdsRateLabel}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <StatusBadge status={row.status} />
      </TableCell>
    </TableRow>
  ));

  const desktopContent = isEmpty ? desktopEmptyState : desktopRows;

  return (
    <div>
      <h2 className="mb-4 text-[1.375rem] font-semibold text-ink">
        Commission Ledger
      </h2>

      <ul className="space-y-3 lg:hidden">{mobileContent}</ul>

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
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                GST Amount
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>
                TDS Amount
              </TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>TDS Rate</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{desktopContent}</TableBody>
        </Table>
      </TableScrollShell>
    </div>
  );
}
