import { Button } from '@/shared/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'

interface Product {
  id: string
  name: string
  imageUrl: string
  basePrice: number
}

interface ProductModerationTableProps {
  products: Product[]
  rejectingId: string | null
  rejectNote: string
  onRejectNoteChange: (note: string) => void
  onApprove: (id: string) => void
  onStartReject: (id: string) => void
  onSubmitReject: (id: string) => void
  onCancelReject: () => void
}

export function ProductModerationTable({
  products,
  rejectingId,
  rejectNote,
  onRejectNoteChange,
  onApprove,
  onStartReject,
  onSubmitReject,
  onCancelReject
}: ProductModerationTableProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Product Moderation Queue</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                  <span className="font-medium">{p.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono">₹{p.basePrice}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-success" 
                    onClick={() => onApprove(p.id)}
                  >
                    Approve
                  </Button>
                  {rejectingId === p.id ? (
                    <div className="flex gap-1">
                      <input
                        className="h-8 w-32 rounded border border-line px-2 text-xs"
                        placeholder="Rejection note"
                        value={rejectNote}
                        onChange={(e) => onRejectNoteChange(e.target.value)}
                      />
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        disabled={!rejectNote} 
                        onClick={() => onSubmitReject(p.id)}
                      >
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={onCancelReject}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => onStartReject(p.id)}>
                      Reject
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
