'use client'

import { useState, useCallback, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { adminShippingApi } from '@/features/admin-dashboard/api/shipping.api'
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

  const handleDelete = useCallback(async (id: string, reload: () => void) => {
    await adminShippingApi.deleteZone(id)
    reload()
  }, [])

  const load = useCallback(() => {
    void listVersion
    return adminShippingApi.zones()
  }, [listVersion])

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => (
      <Button size="sm" variant="ghost" onClick={() => handleDelete(String(row.id), reload)}>
        Delete
      </Button>
    ),
    [handleDelete],
  )

  return {
    form: {
      name,
      onNameChange: setName,
      onSubmit: handleCreate,
    },
    title: 'Shipping zones',
    permission: PERMISSIONS.SHIPPING_MANAGE,
    load,
    actions,
  }
}
