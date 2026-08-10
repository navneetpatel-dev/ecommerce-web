'use client'

import { useState, type ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { AdminConfirmAction } from './AdminConfirmAction'
import { VendorKycDocumentsDialog } from './VendorKycDocumentsDialog'
import { adminApi } from '../api/admin.api'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from '../hooks/useAdminDataList'

interface VendorRowActionsProps {
  row: AdminDataRow
  onReload: () => void
}

/** Suspend, delete, and KYC documents actions for the all-vendors list. */
export function VendorRowActions({ row, onReload }: VendorRowActionsProps): ReactNode {
  const [docsOpen, setDocsOpen] = useState(false)
  const name = adminRowLabel(row)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => setDocsOpen(true)}
        >
          <FileText className="size-3.5" aria-hidden />
          {LABELS.viewKycDocuments}
        </Button>
        <AdminConfirmAction
          label={LABELS.suspend}
          dialogVariant="warning"
          tone="neutral"
          title={LABELS.confirmSuspendVendorTitle}
          description={formatLabel(LABELS.confirmSuspendVendorBody, { name })}
          requireReason
          reasonHint={LABELS.enterSuspendReason}
          onConfirm={(reason) => adminApi.suspendVendor(String(row.id), reason ?? '').then(onReload)}
        />
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          tone="danger"
          title={LABELS.confirmDeleteVendorTitle}
          description={formatLabel(LABELS.confirmDeleteVendorBody, { name })}
          onConfirm={() => adminApi.deleteVendor(String(row.id)).then(onReload)}
        />
      </div>

      <VendorKycDocumentsDialog
        vendorId={String(row.id)}
        vendorName={name}
        open={docsOpen}
        onOpenChange={setDocsOpen}
      />
    </>
  )
}
