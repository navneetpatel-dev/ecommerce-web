'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { useVendorProductsTable } from './useVendorProductsTable'
import { categoriesApi } from '@/features/categories/api/categories.api'
import { flattenCategoriesWithDepth } from '@/features/categories/utils/categoryHelpers'
import { productsApi } from '@/features/products/api/products.api'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
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
  const table = useVendorProductsTable()
  const { hasPermission } = usePermissions()

  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [draftUploadId, setDraftUploadId] = useState(() => crypto.randomUUID())
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [createError, setCreateError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [imagesTarget, setImagesTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    void categoriesApi.list().then((rows) => {
      const tree = Array.isArray(rows) ? rows : []
      const flat = flattenCategoriesWithDepth(tree).map((row) => ({
        id: row.id,
        name: `${'— '.repeat(row.depth)}${row.name}`.trim(),
      }))
      setCategories(flat)
      if (flat[0]?.id) setCategoryId(String(flat[0].id))
    })
  }, [])

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!categoryId) {
        setCreateError(LABELS.selectCategory)
        return
      }
      setCreating(true)
      setCreateError(null)
      try {
        const product = await productsApi.create({
          name,
          categoryId,
          basePrice: Number(price),
          description: description || name,
        })
        for (let i = 0; i < imageUrls.length; i += 1) {
          const url = imageUrls[i]!
          await productsApi.addImage(product.id, { url, isPrimary: i === 0 })
        }
        setName('')
        setPrice('')
        setDescription('')
        setImageUrls([])
        setDraftUploadId(crypto.randomUUID())
        setShowCreate(false)
        router.refresh()
      } catch (err: unknown) {
        setCreateError(getApiErrorMessage(err, LABELS.uploadFailed))
      } finally {
        setCreating(false)
      }
    },
    [name, price, description, categoryId, imageUrls, router],
  )

  const handleEdit = useCallback(
    (productId: string, productName: string) => {
      const nextName = window.prompt('Product name', productName)
      if (nextName && nextName !== productName) {
        productsApi.update(productId, { name: nextName }).then(() => router.refresh())
      }
    },
    [router],
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

  const createFormProps = {
    name,
    price,
    description,
    categoryId,
    categories,
    imageUrls,
    draftUploadId,
    createError,
    creating,
    onNameChange: setName,
    onPriceChange: setPrice,
    onDescriptionChange: setDescription,
    onCategoryChange: setCategoryId,
    onImageUrlsChange: setImageUrls,
    onSubmit: handleCreate,
    onCancel: () => {
      setShowCreate(false)
      setImageUrls([])
      setDraftUploadId(crypto.randomUUID())
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
    onAddProduct: canCreate ? () => setShowCreate(true) : undefined,
    onEditProduct: canEdit
      ? (product: { id: string; name: string }) => handleEdit(product.id, product.name)
      : undefined,
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
    title: 'Delete product?',
    description: table.deleteTarget
      ? `Delete "${table.deleteTarget.name}"? This cannot be undone.`
      : 'This cannot be undone.',
    secondaryAction: { label: 'Cancel', onClick: () => table.setDeleteTarget(null) },
    primaryAction: {
      label: 'Delete',
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
    showCreateForm: showCreate && canCreate,
    createFormProps,
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
