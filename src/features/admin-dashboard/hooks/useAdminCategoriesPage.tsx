'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { AdminEditCategoryAction } from '../components/AdminEditCategoryAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import {
  CATEGORY_FORM_DEFAULTS,
  CategoryFormSchema,
  toCategoryCreateBody,
  type CategoryFormInput,
} from '../schemas/categories.schema'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminCategoriesPageModel = AdminListPageModel & {
  open: boolean
  setOpen: (open: boolean) => void
  form: ReturnType<typeof useForm<CategoryFormInput>>
  isPending: boolean
  onSubmit: (data: CategoryFormInput) => Promise<void>
}

export function useAdminCategoriesPage(): AdminCategoriesPageModel {
  const [listVersion, setListVersion] = useState(0)
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: CATEGORY_FORM_DEFAULTS,
  })

  const onSubmit = useCallback(async (data: CategoryFormInput) => {
    setIsPending(true)
    try {
      await categoriesApi.create(toCategoryCreateBody(data))
      form.reset(CATEGORY_FORM_DEFAULTS)
      setOpen(false)
      setListVersion((version) => version + 1)
    } finally {
      setIsPending(false)
    }
  }, [form])

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion
      return categoriesApi.listPaginated({ page, limit })
    },
    [listVersion],
  )

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const label = adminRowLabel(row)

    return (
      <>
        <AdminEditCategoryAction
          category={{
            id: String(row.id),
            name: String(row.name ?? ''),
            parentId: (row.parentId as string | null | undefined) ?? null,
            imageUrl: (row.imageUrl as string | null | undefined) ?? null,
            status: (row.status as string | null | undefined) ?? null,
          }}
          onSaved={reload}
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
    open,
    setOpen,
    form,
    isPending,
    onSubmit,
    title: LABELS.categories,
    permission: PERMISSIONS.CATEGORY_MANAGE,
    load,
    actions,
    columnKeys: ['name', 'slug', 'status', 'imageUrl', 'parentId'],
  }
}
