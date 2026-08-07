'use client'

import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { AdminEditCategoryAction } from '../components/AdminEditCategoryAction'
import { useAdminDataList } from './useAdminDataList'
import {
  CATEGORY_FORM_DEFAULTS,
  CategoryFormSchema,
  toCategoryCreateBody,
  type CategoryFormInput,
} from '../schemas/categories.schema'
import type { Category } from '@/shared/api/types'

export function useAdminCategoriesPage() {
  const [listVersion, setListVersion] = useState(0)
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(CategoryFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: CATEGORY_FORM_DEFAULTS,
  })

  const load = useCallback(
    async ({ page, limit }: { page: number; limit: number }) => {
      void listVersion
      return categoriesApi.listPaginated({ page, limit })
    },
    [listVersion],
  )

  const list = useAdminDataList(load)

  const onSubmit = useCallback(
    async (data: CategoryFormInput) => {
      setIsPending(true)
      setCreateError(null)
      try {
        await categoriesApi.create(toCategoryCreateBody(data))
        form.reset(CATEGORY_FORM_DEFAULTS)
        setOpen(false)
        setListVersion((version) => version + 1)
      } catch (err) {
        setCreateError(getApiErrorMessage(err, LABELS.couldNotLoadData))
      } finally {
        setIsPending(false)
      }
    },
    [form],
  )

  const setDialogOpen = useCallback(
    (next: boolean) => {
      setOpen(next)
      if (!next) setCreateError(null)
    },
    [],
  )

  const renderActions = useCallback(
    (row: Category) => (
      <>
        <AdminEditCategoryAction
          category={{
            id: row.id,
            name: row.name,
            parentId: row.parentId,
            imageUrl: row.imageUrl,
            status: row.status,
          }}
          onSaved={list.reload}
        />
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteCategoryTitle}
          description={formatLabel(LABELS.confirmDeleteCategoryBody, { name: row.name })}
          onConfirm={() => categoriesApi.delete(row.id).then(list.reload)}
        />
      </>
    ),
    [list.reload],
  )

  return {
    open,
    setOpen: setDialogOpen,
    form,
    isPending,
    createError,
    onSubmit,
    title: LABELS.categories,
    permission: PERMISSIONS.CATEGORY_MANAGE,
    categories: list.rows as unknown as Category[],
    loading: list.loading,
    error: list.error,
    reload: list.reload,
    pagination: {
      page: list.page,
      totalPages: list.totalPages,
      total: list.total,
      from: list.from,
      to: list.to,
      onPageChange: list.onPageChange,
    },
    renderActions,
  }
}
