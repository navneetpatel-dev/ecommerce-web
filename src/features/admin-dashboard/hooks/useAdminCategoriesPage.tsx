'use client'

import { useState, useCallback, type FormEvent, type ReactNode } from 'react'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { AdminEditNameAction } from '../components/AdminEditNameAction'
import { adminRowLabel } from '../utils/adminRowLabel'
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

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion
      return categoriesApi.listPaginated({ page, limit })
    },
    [listVersion],
  )

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const label = adminRowLabel(row)
    const currentName = String(row.name ?? '')

    return (
      <>
        <AdminEditNameAction
          currentName={currentName}
          title={LABELS.editCategoryTitle}
          description={LABELS.editCategoryBody}
          fieldLabel={LABELS.categoryName}
          emptyHint={LABELS.enterCategoryNameToSave}
          onSave={(nextName) => categoriesApi.update(String(row.id), { name: nextName }).then(reload)}
        />
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteCategoryTitle}
          description={formatLabel(LABELS.confirmDeleteCategoryBody, { name: label })}
          onConfirm={() => categoriesApi.delete(String(row.id)).then(reload)}
        />
      </>
    )
  }, [])

  return {
    form: {
      name,
      onNameChange: setName,
      onSubmit: handleCreate,
    },
    title: LABELS.categories,
    permission: PERMISSIONS.CATEGORY_MANAGE,
    load,
    actions,
  }
}
