'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileUpload } from '@/shared/components/FileUpload'
import { FormActions, FormFieldFrame, FormSection } from '@/shared/components/forms'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'
import {
  PROMO_BANNER_LINK_TYPE,
  PROMO_BANNER_LINK_TYPE_VALUES,
  PROMO_BANNER_STATUS,
  PROMO_BANNER_STATUS_VALUES,
  type PromoBannerLinkType,
  type PromoBannerStatus,
} from '@/shared/constants/statuses'
import type { PromoBanner } from '@/shared/api/types'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { formatLabel } from '@/shared/utils/formatLabel'
import { TableRowActions, TableRowAction } from '@/shared/components/TableRowActions'
import { tableMenuButtonClass } from '@/shared/constants/tableActionTone'
import { homepageAdminApi } from '../api/homepage.api'

function newDraftId() {
  return crypto.randomUUID()
}

export function AdminPromoBannersPage() {
  const [banners, setBanners] = useState<PromoBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [draftId, setDraftId] = useState(newDraftId)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [linkType, setLinkType] = useState<PromoBannerLinkType>(PROMO_BANNER_LINK_TYPE.URL)
  const [linkTargetId, setLinkTargetId] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [status, setStatus] = useState<PromoBannerStatus>(PROMO_BANNER_STATUS.DRAFT)
  const [priority, setPriority] = useState('0')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null)
  const [editLinkType, setEditLinkType] = useState<PromoBannerLinkType>(PROMO_BANNER_LINK_TYPE.URL)
  const [editLinkTargetId, setEditLinkTargetId] = useState('')
  const [editLinkUrl, setEditLinkUrl] = useState('')
  const [editStatus, setEditStatus] = useState<PromoBannerStatus>(PROMO_BANNER_STATUS.DRAFT)
  const [editPriority, setEditPriority] = useState('0')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setBanners(await homepageAdminApi.listBanners())
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadPromoBanners))
      setBanners([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const resetForm = () => {
    setDraftId(newDraftId())
    setTitle('')
    setImageUrl(null)
    setLinkType(PROMO_BANNER_LINK_TYPE.URL)
    setLinkTargetId('')
    setLinkUrl('')
    setStatus(PROMO_BANNER_STATUS.DRAFT)
    setPriority('0')
  }

  const canSubmit = useMemo(() => {
    if (!title.trim() || !imageUrl) return false
    if (linkType === PROMO_BANNER_LINK_TYPE.URL) return Boolean(linkUrl.trim())
    return Boolean(linkTargetId.trim())
  }, [title, imageUrl, linkType, linkUrl, linkTargetId])

  const onCreate = async () => {
    if (!canSubmit || !imageUrl) return
    setSaving(true)
    setMessage(null)
    try {
      await homepageAdminApi.createBanner({
        title: title.trim(),
        imageUrl,
        linkType,
        linkTargetId: linkType === PROMO_BANNER_LINK_TYPE.URL ? null : linkTargetId.trim(),
        linkUrl: linkType === PROMO_BANNER_LINK_TYPE.URL ? linkUrl.trim() : null,
        status,
        priority: Number(priority) || 0,
      })
      setMessage(LABELS.promoBannerSaved)
      resetForm()
      await load()
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (banner: PromoBanner) => {
    if (!window.confirm(formatLabel(LABELS.confirmDeletePromoBannerBody, { name: banner.title }))) {
      return
    }
    setMessage(null)
    try {
      await homepageAdminApi.deleteBanner(banner.id)
      setMessage(LABELS.promoBannerDeleted)
      await load()
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner))
    }
  }

  const onActivate = async (banner: PromoBanner) => {
    setMessage(null)
    try {
      await homepageAdminApi.updateBanner(banner.id, { status: PROMO_BANNER_STATUS.ACTIVE })
      setMessage(LABELS.promoBannerSaved)
      await load()
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner))
    }
  }

  const startEdit = (banner: PromoBanner) => {
    setEditingId(banner.id)
    setEditTitle(banner.title)
    setEditImageUrl(banner.imageUrl)
    setEditLinkType(banner.linkType as PromoBannerLinkType)
    setEditLinkTargetId(banner.linkTargetId ?? '')
    setEditLinkUrl(banner.linkUrl ?? '')
    setEditStatus(banner.status as PromoBannerStatus)
    setEditPriority(String(banner.priority ?? 0))
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditImageUrl(null)
  }

  const onSaveEdit = async () => {
    if (!editingId || !editTitle.trim() || !editImageUrl) return
    setSaving(true)
    setMessage(null)
    try {
      await homepageAdminApi.updateBanner(editingId, {
        title: editTitle.trim(),
        imageUrl: editImageUrl,
        linkType: editLinkType,
        linkTargetId: editLinkType === PROMO_BANNER_LINK_TYPE.URL ? null : editLinkTargetId.trim(),
        linkUrl: editLinkType === PROMO_BANNER_LINK_TYPE.URL ? editLinkUrl.trim() : null,
        status: editStatus,
        priority: Number(editPriority) || 0,
      })
      setMessage(LABELS.promoBannerSaved)
      cancelEdit()
      await load()
    } catch (err) {
      setMessage(getApiErrorMessage(err, LABELS.couldNotSavePromoBanner))
    } finally {
      setSaving(false)
    }
  }

  return (
    <RequirePermission permission={PERMISSIONS.BANNER_MANAGE}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.promoBanners}
          </h2>
          <p className="max-w-2xl text-[0.9375rem] text-ink-muted">{LABELS.promoBannersHint}</p>
        </div>

        <FormSection
          title={LABELS.promoBannerFormSection}
          hint={LABELS.promoBannerFormSectionHint}
        >
          <FormFieldFrame label={LABELS.promoBannerTitle} className="sm:col-span-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.promoBannerImage} className="sm:col-span-2">
            <FileUpload
              entityType={UPLOAD_ENTITY.BANNERS}
              entityId={draftId}
              purpose={UPLOAD_PURPOSE.IMAGE}
              accept="image/png,image/jpeg,image/webp"
              valueUrl={imageUrl}
              onUploaded={setImageUrl}
              disabled={saving}
              label={LABELS.promoBannerImage}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.promoBannerLinkType}>
            <Select
              value={linkType}
              onValueChange={(value) => setLinkType(value as PromoBannerLinkType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMO_BANNER_LINK_TYPE_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.promoBannerStatus}>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as PromoBannerStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROMO_BANNER_STATUS_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
          {linkType === PROMO_BANNER_LINK_TYPE.URL ? (
            <FormFieldFrame label={LABELS.promoBannerLinkUrl} className="sm:col-span-2">
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            </FormFieldFrame>
          ) : (
            <FormFieldFrame label={LABELS.promoBannerLinkTargetId} className="sm:col-span-2">
              <Input value={linkTargetId} onChange={(e) => setLinkTargetId(e.target.value)} />
            </FormFieldFrame>
          )}
          <FormFieldFrame label={LABELS.promoBannerPriority}>
            <Input
              type="number"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </FormFieldFrame>
          <FormActions className="sm:col-span-2 border-0 pt-0" leading={message}>
            <Button type="button" disabled={saving || !canSubmit} onClick={() => void onCreate()}>
              {LABELS.createPromoBanner}
            </Button>
          </FormActions>
        </FormSection>

        {loading ? <p className="text-ink-muted">{LABELS.loading}</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}
        {!loading && !error && banners.length === 0 ? (
          <p className="text-ink-muted">{LABELS.noPromoBanners}</p>
        ) : null}

        {!loading && banners.length > 0 ? (
          <ul className="divide-y divide-line rounded-md border border-line bg-surface">
            {banners.map((banner) => (
              <li
                key={banner.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                {editingId === banner.id ? (
                  <FormSection
                    title={LABELS.promoBannerEditSection}
                    hint={LABELS.promoBannerEditSectionHint}
                    className="w-full border-0 shadow-none"
                  >
                    <FormFieldFrame label={LABELS.promoBannerTitle} className="sm:col-span-2">
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </FormFieldFrame>
                    <FormFieldFrame label={LABELS.promoBannerImage} className="sm:col-span-2">
                      <FileUpload
                        entityType={UPLOAD_ENTITY.BANNERS}
                        entityId={banner.id}
                        purpose={UPLOAD_PURPOSE.IMAGE}
                        accept="image/png,image/jpeg,image/webp"
                        valueUrl={editImageUrl}
                        onUploaded={setEditImageUrl}
                        disabled={saving}
                        label={LABELS.replaceImage}
                      />
                    </FormFieldFrame>
                    <FormFieldFrame label={LABELS.promoBannerStatus}>
                      <Select
                        value={editStatus}
                        onValueChange={(value) => setEditStatus(value as PromoBannerStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROMO_BANNER_STATUS_VALUES.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldFrame>
                    <FormFieldFrame label={LABELS.promoBannerPriority}>
                      <Input
                        type="number"
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                      />
                    </FormFieldFrame>
                    <FormActions className="sm:col-span-2 border-0 pt-0">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={cancelEdit}
                      >
                        {LABELS.cancel}
                      </Button>
                      <Button
                        size="sm"
                        disabled={saving || !editImageUrl}
                        onClick={() => void onSaveEdit()}
                      >
                        {LABELS.savePromoBanner}
                      </Button>
                    </FormActions>
                  </FormSection>
                ) : (
                  <>
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-[0.9375rem] font-medium text-ink">{banner.title}</p>
                      <p className="text-[0.8125rem] text-ink-muted">
                        {banner.status} · {banner.linkType} · {LABELS.promoBannerPriority}{' '}
                        {banner.priority}
                      </p>
                    </div>
                    <TableRowActions className="shrink-0">
                      <TableRowAction>
                        <Button
                          size="sm"
                          variant="outline"
                          className={tableMenuButtonClass('edit')}
                          onClick={() => startEdit(banner)}
                        >
                          {LABELS.editPromoBanner}
                        </Button>
                      </TableRowAction>
                      {banner.status !== PROMO_BANNER_STATUS.ACTIVE ? (
                        <TableRowAction>
                          <Button
                            size="sm"
                            variant="outline"
                            className={tableMenuButtonClass('success')}
                            onClick={() => void onActivate(banner)}
                          >
                            {PROMO_BANNER_STATUS.ACTIVE}
                          </Button>
                        </TableRowAction>
                      ) : null}
                      <TableRowAction destructive>
                        <Button
                          size="sm"
                          variant="outline"
                          className={tableMenuButtonClass('danger')}
                          onClick={() => void onDelete(banner)}
                        >
                          {LABELS.delete}
                        </Button>
                      </TableRowAction>
                    </TableRowActions>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </RequirePermission>
  )
}
