import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { StatusBadge } from '@/shared/components/StatusBadge'

interface Commission {
  id: string
  createdAt: string
  saleAmount: number
  commissionRate: number
  commissionAmount: number
  status: string
}

interface CommissionLedgerTableProps {
  commissions?: { items?: Commission[] }
}

export function CommissionLedgerTable({ commissions }: CommissionLedgerTableProps) {
  return (
    <div>
      <h2 className="text-[1.375rem] font-semibold text-ink mb-4">Commission Ledger</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Sale Amount</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions?.items?.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center text-ink-muted">No entries yet</TableCell></TableRow>
          ) : commissions?.items?.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="text-[0.9375rem]">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="font-mono">₹{c.saleAmount}</TableCell>
              <TableCell>{c.commissionRate}%</TableCell>
              <TableCell className="font-mono">₹{c.commissionAmount}</TableCell>
              <TableCell><StatusBadge status={c.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
