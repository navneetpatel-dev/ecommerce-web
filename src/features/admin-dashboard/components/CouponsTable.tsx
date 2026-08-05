import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { StatusBadge } from '@/shared/components/StatusBadge'

interface Coupon {
  id: string
  code: string
  type: string
  usedCount: number
  usageLimitTotal?: number
  status: string
  endDate: string
}

interface CouponsTableProps {
  coupons?: Coupon[]
}

export function CouponsTable({ coupons }: CouponsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Expires</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-ink-muted">No coupons</TableCell>
          </TableRow>
        ) : (
          coupons?.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-mono">{c.code}</TableCell>
              <TableCell>{c.type}</TableCell>
              <TableCell className="font-mono text-[0.8125rem]">
                {c.usedCount}/{c.usageLimitTotal || '∞'}
              </TableCell>
              <TableCell>
                <StatusBadge status={c.status} />
              </TableCell>
              <TableCell className="text-[0.8125rem]">
                {new Date(c.endDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
