'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { DataTable, type DataTableColumn, type DataTablePaginationProps } from '@/shared/components/DataTable'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { ModerationRowActions } from './ModerationRowActions'
import { VendorKycDocumentsDialog } from './VendorKycDocumentsDialog'

interface Vendor {
  id: string
  businessName: string
  slug: string
}

interface VendorApprovalTableProps {
  vendors: Vendor[]
  onApprove: (id: string) => void | Promise<unknown>
  onReject: (id: string, reason: string) => void | Promise<unknown>
  isApproving?: boolean
  isRejecting?: boolean
  loading?: boolean
  onRefresh?: () => void
  pagination?: DataTablePaginationProps
}

export function VendorApprovalTable({
  vendors,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  loading = false,
  onRefresh,
  pagination,
}: VendorApprovalTableProps) {
  const [docsVendor, setDocsVendor] = useState<Vendor | null>(null)

  const columns: DataTableColumn<Vendor>[] = [
    {
      id: 'businessName',
      header: LABELS.businessName,
      className: 'font-medium',
      accessor: 'businessName',
    },
    {
      id: 'slug',
      header: LABELS.slug,
      className: 'text-ink-muted',
      accessor: 'slug',
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        rows={vendors}
        loading={loading}
        onRefresh={onRefresh}
        getRowId={(row) => row.id}
        actionsClassName="w-auto min-w-[14rem]"
        pagination={pagination}
        actions={(v) => (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => setDocsVendor(v)}
            >
              <FileText className="size-3.5" aria-hidden />
              {LABELS.viewKycDocuments}
            </Button>
            <ModerationRowActions
              approveTitle={LABELS.confirmApproveVendorTitle}
              approveDescription={formatLabel(LABELS.confirmApproveVendorBody, {
                name: v.businessName,
              })}
              rejectTitle={LABELS.confirmRejectVendorTitle}
              rejectDescription={formatLabel(LABELS.confirmRejectVendorBody, {
                name: v.businessName,
              })}
              rejectFieldLabel={LABELS.reasonRequired}
              rejectEmptyHint={LABELS.enterRejectionReason}
              onConfirmApprove={() => onApprove(v.id)}
              onConfirmReject={(reason) => onReject(v.id, reason)}
              isApproving={isApproving}
              isRejecting={isRejecting}
            />
          </div>
        )}
      />

      {docsVendor ? (
        <VendorKycDocumentsDialog
          vendorId={docsVendor.id}
          vendorName={docsVendor.businessName}
          open={Boolean(docsVendor)}
          onOpenChange={(open) => {
            if (!open) setDocsVendor(null)
          }}
        />
      ) : null}
    </>
  )
}
