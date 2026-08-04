import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { StatusBadge } from '@/shared/components/StatusBadge'

interface Payout {
  id: string
  periodStart: string
  periodEnd: string
  amount: number
  status: string
}

interface PayoutsTableProps {
  payouts?: { items?: Payout[] }
}

export function PayoutsTable({ payouts }: PayoutsTableProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Payouts</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts?.items?.length === 0 ? (
            <TableRow><TableCell colSpan={3} className="text-center text-ink/50">No payouts yet</TableCell></TableRow>
          ) : payouts?.items?.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="text-sm">
                {new Date(p.periodStart).toLocaleDateString()} – {new Date(p.periodEnd).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-mono">₹{p.amount}</TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
