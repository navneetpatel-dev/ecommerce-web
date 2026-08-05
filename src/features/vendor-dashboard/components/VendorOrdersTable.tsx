import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Button } from '@/shared/components/ui/button'

interface VendorOrder {
  id: string
  subOrders?: Array<{
    id: string
    vendor: any
    subtotal: number
    status: string
  }>
}

interface VendorOrdersTableProps {
  orders: VendorOrder[]
  updatingId: string | null
  onSetUpdatingId: (id: string | null) => void
  onStatusChange: (id: string, status: string) => void
}

export function VendorOrdersTable({ orders, updatingId, onSetUpdatingId, onStatusChange }: VendorOrdersTableProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-[1.375rem] font-semibold text-ink">Order Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) =>
            (order.subOrders as any[])?.map((so: any) => (
              <TableRow key={so.id}>
                <TableCell className="font-mono text-[0.8125rem]">{order.id.slice(0, 8)}</TableCell>
                <TableCell><VendorStrip vendor={so.vendor} size="sm" /></TableCell>
                <TableCell className="font-mono">₹{so.subtotal}</TableCell>
                <TableCell><StatusBadge status={so.status} /></TableCell>
                <TableCell className="text-right">
                  {updatingId === so.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <select
                        className="h-11 rounded-sm border border-line bg-surface px-3 text-[0.9375rem]"
                        defaultValue="SHIPPED"
                        onChange={(e) => onStatusChange(so.id, e.target.value)}
                      >
                        <option value="">-- </option>
                        <option value="CONFIRMED">Confirm</option>
                        <option value="SHIPPED">Ship</option>
                        <option value="DELIVERED">Deliver</option>
                        <option value="CANCELLED">Cancel</option>
                      </select>
                      <Button size="sm" variant="ghost" onClick={() => onSetUpdatingId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => onSetUpdatingId(so.id)}>Update</Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
