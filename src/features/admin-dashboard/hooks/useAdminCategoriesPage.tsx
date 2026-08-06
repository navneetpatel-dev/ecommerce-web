'use client'

import { useState, useCallback, type FormEvent, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { categoriesApi } from '@/features/categories/api/categories.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminCategoriesPageModel = AdminListPageModel & {
  form: {
    name: string
    onNameChange: (value: string) => void
    onSubmit: (e: FormEvent) => Promise<void>
  }
}

export function useAdminCategoriesPage(): AdminCategoriesPageModel {
  const [name, setName] = useState('')
  const [listVersion, setListVersion] = useState(0)

  const handleCreate = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (!name.trim()) return
      await categoriesApi.create({ name: name.trim() })
      setName('')
      setListVersion((version) => version + 1)
    },
    [name],
  )

  const handleEdit = useCallback(async (id: string, currentName: string, reload: () => void) => {
    const nextName = window.prompt('Category name', currentName)
    if (nextName && nextName !== currentName) {
      await categoriesApi.update(id, { name: nextName })
      reload()
    }
  }, [])

  const handleDelete = useCallback(async (id: string, reload: () => void) => {
    await categoriesApi.delete(id)
    reload()
  }, [])

  const load = useCallback(() => {
    void listVersion
    return categoriesApi.list()
  }, [listVersion])

  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => handleEdit(String(row.id), String(row.name ?? ''), reload)}
        >
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleDelete(String(row.id), reload)}>
          Delete
        </Button>
      </div>
    ),
    [handleEdit, handleDelete],
  )

  return {
    form: {
      name,
      onNameChange: setName,
      onSubmit: handleCreate,
    },
    title: 'Categories',
    permission: PERMISSIONS.CATEGORY_MANAGE,
    load,
    actions,
  }
}
