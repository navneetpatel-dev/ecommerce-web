import { Button } from '@/shared/components/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'

interface Vendor {
  id: string
  businessName: string
  slug: string
}

interface VendorApprovalTableProps {
  vendors: Vendor[]
  rejectingId: string | null
  rejectReason: string
  onRejectReasonChange: (reason: string) => void
  onApprove: (id: string) => void
  onStartReject: (id: string) => void
  onSubmitReject: (id: string) => void
  onCancelReject: () => void
  isApproving: boolean
}

export function VendorApprovalTable({
  vendors,
  rejectingId,
  rejectReason,
  onRejectReasonChange,
  onApprove,
  onStartReject,
  onSubmitReject,
  onCancelReject,
  isApproving
}: VendorApprovalTableProps) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold mb-4">Vendor Approval Queue</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="font-medium">{v.businessName}</TableCell>
              <TableCell className="text-ink/50">{v.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-success" 
                    onClick={() => onApprove(v.id)} 
                    loading={isApproving}
                  >
                    Approve
                  </Button>
                  {rejectingId === v.id ? (
                    <div className="flex gap-1">
                      <input
                        className="h-8 w-32 rounded border border-line px-2 text-xs"
                        placeholder="Reason required"
                        value={rejectReason}
                        onChange={(e) => onRejectReasonChange(e.target.value)}
                      />
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        disabled={!rejectReason} 
                        onClick={() => onSubmitReject(v.id)}
                      >
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" onClick={onCancelReject}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => onStartReject(v.id)}>
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
