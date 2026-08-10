'use client'

import { DataTable, type DataTableColumn, type DataTablePaginationProps } from '@/shared/components/DataTable'
import { TableRowAction } from '@/shared/components/TableRowActions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { AdminConfirmAction } from './AdminConfirmAction'
import { VendorKycDocumentsMenuAction } from './VendorKycDocumentsMenuAction'

interface Vendor {
  id: string
  businessName: string
  slug: string
  kycComplete?: boolean
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
    {
      id: 'kyc',
      header: LABELS.kycChecklist,
      cell: (v) =>
        v.kycComplete ? LABELS.kycChecklistComplete : LABELS.kycChecklistIncomplete,
    },
  ]

  const rowBusy = isApproving || isRejecting

  return (
    <DataTable
      columns={columns}
      rows={vendors}
      loading={loading}
      onRefresh={onRefresh}
      getRowId={(row) => row.id}
      pagination={pagination}
      actions={(v) => (
        <>
          <TableRowAction>
            <VendorKycDocumentsMenuAction
              vendorId={v.id}
              vendorName={v.businessName}
              onClose={onRefresh}
            />
          </TableRowAction>
          <TableRowAction>
            <AdminConfirmAction
              label={LABELS.approve}
              tone="success"
              dialogVariant="success"
              title={LABELS.confirmApproveVendorTitle}
              description={formatLabel(LABELS.confirmApproveVendorBody, {
                name: v.businessName,
              })}
              confirmLabel={LABELS.approve}
              onConfirm={() => onApprove(v.id)}
              disabled={!v.kycComplete || rowBusy}
              disabledHint={!v.kycComplete ? LABELS.kycApproveBlocked : undefined}
            />
          </TableRowAction>
          <TableRowAction destructive>
            <AdminConfirmAction
              label={LABELS.reject}
              tone="danger"
              dialogVariant="danger"
              title={LABELS.confirmRejectVendorTitle}
              description={formatLabel(LABELS.confirmRejectVendorBody, {
                name: v.businessName,
              })}
              confirmLabel={LABELS.reject}
              requireReason
              reasonHint={LABELS.enterRejectionReason}
              onConfirm={(reason) => onReject(v.id, reason ?? '')}
              disabled={rowBusy}
            />
          </TableRowAction>
        </>
      )}
    />
  )
}
