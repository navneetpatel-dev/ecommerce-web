'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { useRouteQueryDialog } from '@/shared/hooks/useRouteQueryDialog'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { QUERY_PARAMS } from '@/shared/constants/queryParams'
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

export function useVendorProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const table = useVendorProductsTable()
  const { hasPermission } = usePermissions()
  const dialog = useRouteQueryDialog()

  const [values, setValues] = useState<ProductListingFormValues>(() => emptyProductListingValues())
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [draftUploadId, setDraftUploadId] = useState(() => crypto.randomUUID())
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)

  const imagesProductId = searchParams.get(QUERY_PARAMS.images)

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

  const resetFormState = useCallback(
    (categoryId?: string) => {
      setValues(emptyProductListingValues(categoryId ?? categories[0]?.id ?? ''))
      setImageUrls([])
      setDraftUploadId(crypto.randomUUID())
      setSubmitError(null)
      setLoading(false)
    },
    [categories],
  )

  const loadEditProduct = useCallback(
    async (productId: string) => {
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

  const { open, mode, editId, openCreate, openEdit, close, setOpen, setQuery } = dialog

  const lastDialogKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!open || !mode) {
      lastDialogKeyRef.current = null
      return
    }

    const dialogKey = mode === 'edit' ? `edit:${editId ?? ''}` : 'create'
    if (lastDialogKeyRef.current === dialogKey) return
    lastDialogKeyRef.current = dialogKey

    if (mode === 'create') {
      if (!canCreate) {
        close()
        return
      }
      queueMicrotask(() => resetFormState(categories[0]?.id))
      return
    }

    if (mode === 'edit' && editId) {
      if (!canEdit) {
        close()
        return
      }
      queueMicrotask(() => {
        void loadEditProduct(editId)
      })
    }
  }, [
    canCreate,
    canEdit,
    categories,
    close,
    editId,
    loadEditProduct,
    mode,
    open,
    resetFormState,
  ])

  const handleValidSubmit = useCallback(
    async (body: ProductWriteBody) => {
      setSubmitting(true)
      setSubmitError(null)
      try {
        if (mode === 'edit' && editId) {
          await productsApi.update(editId, body)
        } else {
          const product = await productsApi.create(body)
          for (let index = 0; index < imageUrls.length; index += 1) {
            const url = imageUrls[index]!
            await productsApi.addImage(product.id, { url, isPrimary: index === 0 })
          }
        }
        close()
        resetFormState(categories[0]?.id)
        router.refresh()
      } catch (err: unknown) {
        setSubmitError(getApiErrorMessage(err, LABELS.couldNotSaveProduct))
      } finally {
        setSubmitting(false)
      }
    },
    [categories, close, editId, imageUrls, mode, resetFormState, router],
  )

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

  const imagesTarget = useMemo(() => {
    if (!imagesProductId) return null
    const product = products.find((row) => row.id === imagesProductId)
    return product ? { id: product.id, name: product.name } : null
  }, [imagesProductId, products])

  const showProductDialog =
    open && ((mode === 'create' && canCreate) || (mode === 'edit' && canEdit))

  const formDialogProps = {
    open: showProductDialog,
    mode: (mode === 'edit' ? 'edit' : 'create') as 'create' | 'edit',
    onOpenChange: setOpen,
    onCancel: close,
    formProps: {
      values,
      categories,
      imageUrls,
      draftUploadId: editId ?? draftUploadId,
      submitError,
      submitting,
      loading,
      onChange: (patch: Partial<ProductListingFormValues>) => {
        setValues((current) => ({ ...current, ...patch }))
      },
      onImageUrlsChange: setImageUrls,
      onValidSubmit: handleValidSubmit,
    },
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
    onAddProduct: canCreate ? () => openCreate() : undefined,
    onEditProduct: canEdit ? (product: { id: string }) => openEdit(product.id) : undefined,
    onDeleteProduct: canDelete
      ? (product: { id: string; name: string }) =>
          table.setDeleteTarget({ id: product.id, name: product.name })
      : undefined,
    onSubmitForApproval: canEdit
      ? (product: { id: string }) => table.submitForApproval(product.id)
      : undefined,
    onManageImages: canEdit
      ? (product: { id: string; name: string }) =>
          setQuery({
            [QUERY_PARAMS.images]: product.id,
            [QUERY_PARAMS.create]: null,
            [QUERY_PARAMS.edit]: null,
          })
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
    formDialogProps,
    tableViewProps,
    deleteDialogProps,
    imagesDialogProps: imagesTarget
      ? {
          productId: imagesTarget.id,
          productName: imagesTarget.name,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) {
              setQuery({ [QUERY_PARAMS.images]: null })
            }
          },
          onChanged: () => router.refresh(),
        }
      : null,
    ImagesDialog: VendorProductImagesDialog,
  }
}
