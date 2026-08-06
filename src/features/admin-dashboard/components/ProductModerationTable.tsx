import { Button } from '@/shared/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { MediaImage } from '@/shared/components/MediaImage'

interface Product {
  id: string
  name: string
  imageUrl?: string | null
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
      <h2 className="text-[1.375rem] font-semibold text-ink mb-4">Product Moderation Queue</h2>
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
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-paper">
                    <MediaImage
                      src={p.imageUrl}
                      alt={p.name}
                      sizes="40px"
                      imageClassName="object-cover"
                    />
                  </div>
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
                        className="h-11 w-40 rounded-sm border border-line px-3 text-[0.9375rem]"
                        placeholder="Rejection note"
                        value={rejectNote}
                        onChange={(e) => onRejectNoteChange(e.target.value)}
                      />
                      <DisabledActionHint
                        disabled={!rejectNote}
                        message="Enter a rejection note before rejecting."
                      >
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!rejectNote}
                          onClick={() => onSubmitReject(p.id)}
                        >
                          Reject
                        </Button>
                      </DisabledActionHint>
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
