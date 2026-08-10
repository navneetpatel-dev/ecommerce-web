'use client'

import { useEffect, useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { FormActions, FormFieldFrame, FormSection } from '@/shared/components/forms'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import { MAX_PAGE_LIMIT } from '@/shared/constants/pagination'
import { formatLabel } from '@/shared/utils/formatLabel'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { categoriesApi } from '@/features/categories/api/categories.api'
import type { Category } from '@/shared/api/types'

interface AdminReassignProductsActionProps {
  onDone: () => void
}

export function AdminReassignProductsAction({ onDone }: AdminReassignProductsActionProps) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [fromId, setFromId] = useState('')
  const [toId, setToId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    void categoriesApi.listPaginated({ page: 1, limit: MAX_PAGE_LIMIT }).then((result) => {
      setCategories(result.items)
    })
  }, [open])

  const onSubmit = async () => {
    if (!fromId || !toId || fromId === toId) return
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      const result = await categoriesApi.reassignProducts(fromId, toId)
      setMessage(formatLabel(LABELS.productsReassigned, { count: String(result.updatedCount) }))
      onDone()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotReassignProducts))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="shrink-0"
        onClick={() => {
          setOpen(true)
          setError(null)
          setMessage(null)
        }}
      >
        <ArrowRightLeft aria-hidden />
        {LABELS.reassignProducts}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{LABELS.reassignProductsTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-[0.875rem] text-ink-muted">{LABELS.reassignProductsBody}</p>
          <FormSection title={LABELS.reassignProducts} columns={1} className="mt-2">
            <FormFieldFrame label={LABELS.reassignFrom}>
              <Select value={fromId} onValueChange={setFromId}>
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.reassignTo}>
              <Select value={toId} onValueChange={setToId}>
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldFrame>
            {error ? <p className="text-[0.8125rem] text-danger">{error}</p> : null}
            {message ? <p className="text-[0.8125rem] text-success">{message}</p> : null}
            <FormActions className="border-0 pt-0">
              <Button
                disabled={loading || !fromId || !toId || fromId === toId}
                onClick={() => void onSubmit()}
              >
                {LABELS.reassignConfirm}
              </Button>
            </FormActions>
          </FormSection>
        </DialogContent>
      </Dialog>
    </>
  )
}
