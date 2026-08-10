'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, SlidersHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import { CATEGORY_ATTRIBUTE_TYPE } from '@/shared/constants/statuses'
import { cn } from '@/shared/utils/cn'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { tableMenuButtonClass } from '@/shared/constants/tableActionTone'
import { categoriesApi } from '@/features/categories/api/categories.api'
import type { CategoryAttribute } from '@/shared/api/types'

interface AdminCategoryAttributesActionProps {
  categoryId: string
  categoryName: string
}

function parseOptions(type: string, raw: string): unknown[] {
  if (type === CATEGORY_ATTRIBUTE_TYPE.BOOLEAN) return ['true', 'false']
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

function optionsToInput(options: unknown[] | undefined): string {
  if (!options?.length) return ''
  return options.map((opt) => String(opt)).join(', ')
}

function SortableAttributeRow({
  row,
  disabled,
  onEdit,
  onDelete,
}: {
  row: CategoryAttribute
  disabled: boolean
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  })

  return (
    <li
      ref={setNodeRef}
      className="flex items-center justify-between gap-2 text-[0.875rem]"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          className="inline-flex cursor-grab touch-none text-ink-faint hover:text-ink active:cursor-grabbing"
          aria-label={LABELS.dragToReorder}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="truncate">
          {row.name} <span className="text-ink-muted">({row.type})</span>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled}
          onClick={onEdit}
          aria-label={LABELS.editCategoryAttribute}
        >
          <Pencil className="h-4 w-4" aria-hidden />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-danger"
          disabled={disabled}
          onClick={onDelete}
          aria-label={LABELS.deleteCategoryAttribute}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </li>
  )
}

export function AdminCategoryAttributesAction({
  categoryId,
  categoryName,
}: AdminCategoryAttributesActionProps) {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<CategoryAttribute[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [type, setType] = useState<string>(CATEGORY_ATTRIBUTE_TYPE.ENUM)
  const [options, setOptions] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const ids = useMemo(() => rows.map((row) => row.id), [rows])

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setType(CATEGORY_ATTRIBUTE_TYPE.ENUM)
    setOptions('')
  }

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setRows(await categoriesApi.listAttributes(categoryId))
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadData))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      resetForm()
      void load()
    }
  }, [open, categoryId])

  const onSave = async () => {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const body = {
        name: name.trim(),
        type,
        options: parseOptions(type, options),
      }
      if (editingId) {
        await categoriesApi.updateAttribute(categoryId, editingId, body)
      } else {
        await categoriesApi.createAttribute(categoryId, body)
      }
      resetForm()
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveAttribute))
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (attributeId: string) => {
    setLoading(true)
    setError(null)
    try {
      await categoriesApi.deleteAttribute(categoryId, attributeId)
      if (editingId === attributeId) resetForm()
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotDeleteAttribute))
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = rows.findIndex((row) => row.id === active.id)
    const newIndex = rows.findIndex((row) => row.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    const next = arrayMove(rows, oldIndex, newIndex)
    setRows(next)
    setError(null)
    try {
      await categoriesApi.reorderAttributes(
        categoryId,
        next.map((row) => row.id),
      )
    } catch (err) {
      setRows(rows)
      setError(getApiErrorMessage(err, LABELS.couldNotReorderAttributes))
    }
  }

  const startEdit = (row: CategoryAttribute) => {
    setEditingId(row.id)
    setName(row.name)
    setType(row.type)
    setOptions(optionsToInput(row.options))
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className={tableMenuButtonClass('neutral')}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal strokeWidth={2.25} aria-hidden />
        <span>{LABELS.manageAttributes}</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {LABELS.categoryAttributes} — {categoryName}
            </DialogTitle>
          </DialogHeader>
          <p className="text-[0.875rem] text-ink-muted">{LABELS.categoryAttributesHint}</p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <ul className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-line p-3">
                {rows.length === 0 ? (
                  <li className="text-[0.875rem] text-ink-muted">{LABELS.noRecordsFound}</li>
                ) : (
                  rows.map((row) => (
                    <SortableAttributeRow
                      key={row.id}
                      row={row}
                      disabled={loading}
                      onEdit={() => startEdit(row)}
                      onDelete={() => void onDelete(row.id)}
                    />
                  ))
                )}
              </ul>
            </SortableContext>
          </DndContext>

          <div className="space-y-3 border-t border-line pt-4">
            <div className="space-y-2">
              <Label>{LABELS.attributeName}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{LABELS.attributeType}</Label>
              <Select value={type} onValueChange={setType} disabled={Boolean(editingId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CATEGORY_ATTRIBUTE_TYPE.ENUM}>
                    {LABELS.attributeTypeEnum}
                  </SelectItem>
                  <SelectItem value={CATEGORY_ATTRIBUTE_TYPE.RANGE}>
                    {LABELS.attributeTypeRange}
                  </SelectItem>
                  <SelectItem value={CATEGORY_ATTRIBUTE_TYPE.BOOLEAN}>
                    {LABELS.attributeTypeBoolean}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {type !== CATEGORY_ATTRIBUTE_TYPE.BOOLEAN ? (
              <div className="space-y-2">
                <Label>{LABELS.attributeOptions}</Label>
                <Input value={options} onChange={(e) => setOptions(e.target.value)} />
              </div>
            ) : null}
            {error ? <p className="text-[0.8125rem] text-danger">{error}</p> : null}
            <div className="flex gap-2">
              <Button className="flex-1" disabled={loading || !name.trim()} onClick={() => void onSave()}>
                {editingId ? LABELS.saveCategoryAttribute : LABELS.addCategoryAttribute}
              </Button>
              {editingId ? (
                <Button variant="secondary" disabled={loading} onClick={resetForm}>
                  {LABELS.cancelEditAttribute}
                </Button>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
