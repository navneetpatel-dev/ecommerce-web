'use client'

import { useState, useCallback, type FormEvent, type ReactNode } from 'react'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { adminShippingApi } from '@/features/admin-dashboard/api/shipping.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminShippingPageModel = AdminListPageModel & {
  form: {
    name: string
    onNameChange: (value: string) => void
    onSubmit: (e: FormEvent) => Promise<void>
  }
}

export function useAdminShippingPage(): AdminShippingPageModel {
  const [name, setName] = useState('')
  const [listVersion, setListVersion] = useState(0)

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!name.trim()) return
      await adminShippingApi.createZone({ name: name.trim(), states: [], pincodePrefixes: [] })
      setName('')
      setListVersion((version) => version + 1)
    },
    [name],
  )

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion
      return adminShippingApi.zones({ page, limit })
    },
    [listVersion],
  )

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const label = adminRowLabel(row)
    return (
      <AdminConfirmAction
        label={LABELS.delete}
        dialogVariant="danger"
        title={LABELS.confirmDeleteShippingTitle}
        description={formatLabel(LABELS.confirmDeleteShippingBody, { name: label })}
        onConfirm={() => adminShippingApi.deleteZone(String(row.id)).then(reload)}
      />
    )
  }, [])

  return {
    form: {
      name,
      onNameChange: setName,
      onSubmit: handleCreate,
    },
    title: LABELS.shipping,
    permission: PERMISSIONS.SHIPPING_MANAGE,
    load,
    actions,
  }
}
