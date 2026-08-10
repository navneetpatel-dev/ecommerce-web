'use client'

import { StatusBadge } from '@/shared/components/StatusBadge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/table'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { TableRowActions, TableRowAction } from '@/shared/components/TableRowActions'
import { TableScrollShell } from '@/shared/components/TableScrollShell'
import { Plus, Pencil, Trash2, Send, Images } from 'lucide-react'
import { LABELS } from '@/shared/constants/labels'
import { PRODUCT_STATUS } from '@/shared/constants/statuses'
import { tableMenuButtonClass } from '@/shared/constants/tableActionTone'
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_ACTIONS_HEAD_CLASS,
  TABLE_DATA_CELL_CLASS,
  TABLE_PINNED_LAYOUT_CLASS,
} from '@/shared/constants/table'
import { cn } from '@/shared/utils/cn'

interface Product {
  id: string
  name: string
  slug?: string
  sku: string
  stock: number
  lowStockAt: number
  basePrice: number
  status: string
}

interface ProductsTableHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  onAddProduct?: () => void
}

export function ProductsTableHeader({ search, onSearchChange, onAddProduct }: ProductsTableHeaderProps) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <h2 className="text-[1.375rem] font-semibold text-ink">Products</h2>
          <Input
            placeholder="Search products..."
            className="w-full text-[0.9375rem] sm:w-64"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {onAddProduct && (
          <Button size="sm" type="button" fullWidth="mobile" onClick={onAddProduct}>
            <Plus aria-hidden /> Add Product
          </Button>
        )}
      </div>
      <p className="text-[0.8125rem] text-ink-muted">
        Manage your catalog — create, edit names, and delete products you own.
      </p>
    </div>
  )
}

interface ProductActionsProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onSubmitForApproval?: (product: Product) => void
  onManageImages?: (product: Product) => void
  isDeleting?: boolean
  isSubmitting?: boolean
}

function ProductActions({
  product,
  onEdit,
  onDelete,
  onSubmitForApproval,
  onManageImages,
  isDeleting,
  isSubmitting,
}: ProductActionsProps) {
  const canSubmit =
    Boolean(onSubmitForApproval) && product.status === PRODUCT_STATUS.DRAFT

  return (
    <TableRowActions>
      {canSubmit ? (
        <TableRowAction>
          <DisabledActionHint disabled={Boolean(isSubmitting)} message={LABELS.submitForApproval} block>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className={tableMenuButtonClass('success')}
              disabled={isSubmitting}
              onClick={() => onSubmitForApproval?.(product)}
            >
              <Send strokeWidth={2.25} aria-hidden />
              <span>{LABELS.submitForApproval}</span>
            </Button>
          </DisabledActionHint>
        </TableRowAction>
      ) : null}
      {onManageImages ? (
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className={tableMenuButtonClass('neutral')}
            onClick={() => onManageImages(product)}
          >
            <Images strokeWidth={2.25} aria-hidden />
            <span>{LABELS.manageProductImages}</span>
          </Button>
        </TableRowAction>
      ) : null}
      {onEdit ? (
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className={tableMenuButtonClass('edit')}
            onClick={() => onEdit(product)}
          >
            <Pencil strokeWidth={2.25} aria-hidden />
            <span>{LABELS.edit}</span>
          </Button>
        </TableRowAction>
      ) : null}
      {onDelete ? (
        <TableRowAction destructive>
          <DisabledActionHint disabled={Boolean(isDeleting)} message="Deleting this product…" block>
            <Button
              size="sm"
              variant="outline"
              type="button"
              className={tableMenuButtonClass('danger')}
              disabled={isDeleting}
              onClick={() => onDelete(product)}
            >
              <Trash2 strokeWidth={2.25} aria-hidden />
              <span>{LABELS.delete}</span>
            </Button>
          </DisabledActionHint>
        </TableRowAction>
      ) : null}
    </TableRowActions>
  )
}

interface ProductRowProps {
  product: Product
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onSubmitForApproval?: (product: Product) => void
  onManageImages?: (product: Product) => void
  isDeleting?: boolean
  isSubmitting?: boolean
}

export function ProductRow({
  product,
  onEdit,
  onDelete,
  onSubmitForApproval,
  onManageImages,
  isDeleting,
  isSubmitting,
}: ProductRowProps) {
  return (
    <TableRow>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, 'font-medium')}>{product.name}</TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, 'font-mono text-[0.8125rem]')}>{product.sku}</TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <span className={product.stock <= product.lowStockAt ? 'text-danger font-medium' : ''}>
          {product.stock}
        </span>
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, 'font-mono')}>₹{product.basePrice}</TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell className={TABLE_ACTIONS_CELL_CLASS}>
        <ProductActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmitForApproval={onSubmitForApproval}
          onManageImages={onManageImages}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
        />
      </TableCell>
    </TableRow>
  )
}

interface ProductsTableContentProps {
  products?: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onSubmitForApproval?: (product: Product) => void
  onManageImages?: (product: Product) => void
  isDeleting?: boolean
  isSubmitting?: boolean
}

export function ProductsTableContent({
  products,
  onEdit,
  onDelete,
  onSubmitForApproval,
  onManageImages,
  isDeleting,
  isSubmitting,
}: ProductsTableContentProps) {
  if (products?.length === 0) {
    return (
      <div className="rounded-md border border-line bg-surface px-4 py-14 text-center text-ink-muted">
        No products found
      </div>
    )
  }

  return (
    <>
      {/* Below lg: card list + kebab actions */}
      <ul className="space-y-3 lg:hidden">
        {products?.map((product) => (
          <li
            key={product.id}
            className="rounded-md border border-line bg-surface p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="truncate text-[0.9375rem] font-medium text-ink">{product.name}</p>
                <p className="font-mono text-[0.8125rem] text-ink-muted">{product.sku}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line/80 pt-3 text-[0.875rem]">
              <div>
                <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">Stock</dt>
                <dd className={product.stock <= product.lowStockAt ? 'text-danger font-medium' : 'text-ink'}>
                  {product.stock}
                </dd>
              </div>
              <div>
                <dt className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted">Price</dt>
                <dd className="font-mono text-ink">₹{product.basePrice}</dd>
              </div>
            </dl>
            <div className="mt-4 border-t border-line/80 pt-3">
              <ProductActions
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onSubmitForApproval={onSubmitForApproval}
                onManageImages={onManageImages}
                isDeleting={isDeleting}
                isSubmitting={isSubmitting}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* lg+: horizontal scroll + pinned actions */}
      <TableScrollShell desktopOnly>
        <Table scrollContainer={false} className={TABLE_PINNED_LAYOUT_CLASS}>
          <TableHeader>
            <TableRow>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Product</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>SKU</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Stock</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Price</TableHead>
              <TableHead className={TABLE_DATA_CELL_CLASS}>Status</TableHead>
              <TableHead className={TABLE_ACTIONS_HEAD_CLASS}>{LABELS.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onSubmitForApproval={onSubmitForApproval}
                onManageImages={onManageImages}
                isDeleting={isDeleting}
                isSubmitting={isSubmitting}
              />
            ))}
          </TableBody>
        </Table>
      </TableScrollShell>
    </>
  )
}
