'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useVendorProductsTable } from './useVendorProductsTable'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { flattenCategoriesWithDepth } from '@/features/categories/utils/categoryHelpers'
import { productsApi } from '@/features/products/api/products.api'
import {
  emptyProductListingValues,
  listingValuesFromProduct,
  type ProductListingFormValues,
  type ProductWriteBody,
} from '@/features/products/schemas/products.schema'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { formatLabel } from '@/shared/utils/formatLabel'
import { PRODUCT_STATUS } from '@/shared/constants/statuses'
import { VendorProductImagesDialog } from '../components/VendorProductImagesDialog'
import type { ProductListItem } from '@/shared/api/types'

type RichProductItem = ProductListItem & {
  sku?: string
  status?: string
  variants?: Array<{ id: string; sku?: string; stock?: number; lowStockAt?: number }>
}

type FormMode = 'create' | 'edit'

export function useVendorProductsPage() {
  const router = useRouter()
  const table = useVendorProductsTable()
  const { hasPermission } = usePermissions()

  const [mode, setMode] = useState<FormMode | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [values, setValues] = useState<ProductListingFormValues>(() => emptyProductListingValues())
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [draftUploadId, setDraftUploadId] = useState(() => crypto.randomUUID())
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagesTarget, setImagesTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    void categoriesApi.list().then((rows) => {
      const tree = Array.isArray(rows) ? rows : []
      const flat = flattenCategoriesWithDepth(tree).map((row) => ({
        id: row.id,
        name: `${'— '.repeat(row.depth)}${row.name}`.trim(),
      }))
      setCategories(flat)
      setValues((current) =>
        current.categoryId || !flat[0]?.id
          ? current
          : { ...current, categoryId: String(flat[0].id) },
      )
    })
  }, [])

  const resetForm = useCallback(
    (nextMode: FormMode | null, categoryId?: string) => {
      setMode(nextMode)
      setEditingId(null)
      setValues(emptyProductListingValues(categoryId ?? categories[0]?.id ?? ''))
      setImageUrls([])
      setDraftUploadId(crypto.randomUUID())
      setSubmitError(null)
      setLoading(false)
    },
    [categories],
  )

  const handleValidSubmit = useCallback(
    async (body: ProductWriteBody) => {
      setSubmitting(true)
      setSubmitError(null)
      try {
        if (mode === 'edit' && editingId) {
          await productsApi.update(editingId, body)
        } else {
          const product = await productsApi.create(body)
          for (let index = 0; index < imageUrls.length; index += 1) {
            const url = imageUrls[index]!
            await productsApi.addImage(product.id, { url, isPrimary: index === 0 })
          }
        }
        resetForm(null)
        router.refresh()
      } catch (err: unknown) {
        setSubmitError(getApiErrorMessage(err, LABELS.couldNotSaveProduct))
      } finally {
        setSubmitting(false)
      }
    },
    [editingId, imageUrls, mode, resetForm, router],
  )

  const handleEdit = useCallback(
    async (productId: string) => {
      setMode('edit')
      setEditingId(productId)
      setValues(emptyProductListingValues(categories[0]?.id ?? ''))
      setImageUrls([])
      setSubmitError(null)
      setLoading(true)
      try {
        const product = await productsApi.detail(productId)
        setValues(listingValuesFromProduct(product))
      } catch (err: unknown) {
        setSubmitError(getApiErrorMessage(err, LABELS.couldNotLoadProduct))
      } finally {
        setLoading(false)
      }
    },
    [categories],
  )

  const canCreate = hasPermission(PERMISSIONS.PRODUCT_CREATE)
  const canEdit = hasPermission(PERMISSIONS.PRODUCT_UPDATE)
  const canDelete = hasPermission(PERMISSIONS.PRODUCT_DELETE)

  const products = useMemo(
    () =>
      (table.data?.items ?? []).map((product: RichProductItem) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.variants?.[0]?.sku ?? product.sku ?? '—',
        stock: product.stock ?? product.variants?.[0]?.stock ?? 0,
        lowStockAt: product.variants?.[0]?.lowStockAt ?? 5,
        basePrice: product.basePrice,
        status: product.status ?? PRODUCT_STATUS.LIVE,
      })),
    [table.data?.items],
  )

  const showForm =
    (mode === 'create' && canCreate) || (mode === 'edit' && canEdit)

  const formProps = {
    mode: mode === 'edit' ? ('edit' as const) : ('create' as const),
    values,
    categories,
    imageUrls,
    draftUploadId: editingId ?? draftUploadId,
    submitError,
    submitting,
    loading,
    onChange: (patch: Partial<ProductListingFormValues>) => {
      setValues((current) => ({ ...current, ...patch }))
    },
    onImageUrlsChange: setImageUrls,
    onValidSubmit: handleValidSubmit,
    onCancel: () => resetForm(null),
  }

  const tableViewProps = {
    search: table.search,
    isLoading: table.isLoading,
    products,
    page: table.page,
    totalPages: table.data?.totalPages,
    isDeleting: table.isDeleting,
    isSubmitting: table.isSubmitting,
    actionMessage: table.actionMessage,
    onSearchChange: table.handleSearchChange,
    onPageChange: table.setPage,
    onAddProduct: canCreate
      ? () => resetForm('create', categories[0]?.id)
      : undefined,
    onEditProduct: canEdit ? (product: { id: string }) => void handleEdit(product.id) : undefined,
    onDeleteProduct: canDelete
      ? (product: { id: string; name: string }) =>
          table.setDeleteTarget({ id: product.id, name: product.name })
      : undefined,
    onSubmitForApproval: canEdit
      ? (product: { id: string }) => table.submitForApproval(product.id)
      : undefined,
    onManageImages: canEdit
      ? (product: { id: string; name: string }) =>
          setImagesTarget({ id: product.id, name: product.name })
      : undefined,
  }

  const deleteDialogProps = {
    open: Boolean(table.deleteTarget),
    onOpenChange: (open: boolean) => {
      if (!open) table.setDeleteTarget(null)
    },
    variant: 'danger' as const,
    icon: Trash2,
    title: LABELS.confirmDeleteProductTitle,
    description: table.deleteTarget
      ? formatLabel(LABELS.confirmDeleteProductBody, { name: table.deleteTarget.name })
      : LABELS.confirmDeleteProductFallback,
    secondaryAction: { label: LABELS.cancel, onClick: () => table.setDeleteTarget(null) },
    primaryAction: {
      label: LABELS.delete,
      variant: 'destructive' as const,
      loading: table.isDeleting,
      onClick: () => {
        table.confirmDelete()
      },
    },
  }

  return {
    permission: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
    ] as const,
    showForm,
    formKey: editingId ?? 'create',
    formProps,
    tableViewProps,
    deleteDialogProps,
    imagesDialogProps: imagesTarget
      ? {
          productId: imagesTarget.id,
          productName: imagesTarget.name,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) setImagesTarget(null)
          },
          onChanged: () => router.refresh(),
        }
      : null,
    ImagesDialog: VendorProductImagesDialog,
  }
}
