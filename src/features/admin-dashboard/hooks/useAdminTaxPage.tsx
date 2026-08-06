'use client'

import { useState, useCallback, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { taxApi } from '@/features/admin-dashboard/api/tax.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminTaxPageModel = AdminListPageModel & {
  form: {
    gstPercentage: string
    hsnCode: string
    onGstChange: (value: string) => void
    onHsnChange: (value: string) => void
    onSubmit: (e: FormEvent) => Promise<void>
  }
}

export function useAdminTaxPage(): AdminTaxPageModel {
  const [gstPercentage, setGstPercentage] = useState('18')
  const [hsnCode, setHsnCode] = useState('')
  const [listVersion, setListVersion] = useState(0)

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      await taxApi.createRule({ gstPercentage: Number(gstPercentage), hsnCode: hsnCode || undefined })
      setHsnCode('')
      setGstPercentage('18')
      setListVersion((version) => version + 1)
    },
    [gstPercentage, hsnCode],
  )

  const handleDelete = useCallback(async (id: string, reload: () => void) => {
    await taxApi.deleteRule(id)
    reload()
  }, [])

  const load = useCallback(() => {
    void listVersion
    return taxApi.getRules()
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
      gstPercentage,
      hsnCode,
      onGstChange: setGstPercentage,
      onHsnChange: setHsnCode,
      onSubmit: handleCreate,
    },
    title: 'Tax rules',
    permission: PERMISSIONS.TAX_MANAGE,
    load,
    actions,
  }
}
