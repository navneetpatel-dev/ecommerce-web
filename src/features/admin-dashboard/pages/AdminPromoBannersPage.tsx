'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileUpload } from '@/shared/components/FileUpload'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { Button } from '@/shared/components/ui/button'
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

        <section className="space-y-4 rounded-md border border-line bg-surface p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>{LABELS.promoBannerTitle}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>{LABELS.promoBannerImage}</Label>
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
            </div>
            <div className="space-y-2">
              <Label>{LABELS.promoBannerLinkType}</Label>
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
            </div>
            <div className="space-y-2">
              <Label>{LABELS.promoBannerStatus}</Label>
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
            </div>
            {linkType === PROMO_BANNER_LINK_TYPE.URL ? (
              <div className="space-y-2 sm:col-span-2">
                <Label>{LABELS.promoBannerLinkUrl}</Label>
                <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              </div>
            ) : (
              <div className="space-y-2 sm:col-span-2">
                <Label>{LABELS.promoBannerLinkTargetId}</Label>
                <Input value={linkTargetId} onChange={(e) => setLinkTargetId(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label>{LABELS.promoBannerPriority}</Label>
              <Input
                type="number"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="min-h-[1.25rem] text-[0.8125rem] text-ink-muted" aria-live="polite">
              {message}
            </p>
            <Button type="button" disabled={saving || !canSubmit} onClick={() => void onCreate()}>
              {LABELS.createPromoBanner}
            </Button>
          </div>
        </section>

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
                  <div className="w-full space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label>{LABELS.promoBannerTitle}</Label>
                        <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>{LABELS.promoBannerImage}</Label>
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
                      </div>
                      <div className="space-y-2">
                        <Label>{LABELS.promoBannerStatus}</Label>
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
                      </div>
                      <div className="space-y-2">
                        <Label>{LABELS.promoBannerPriority}</Label>
                        <Input
                          type="number"
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" disabled={saving || !editImageUrl} onClick={() => void onSaveEdit()}>
                        {LABELS.savePromoBanner}
                      </Button>
                      <Button size="sm" variant="outline" disabled={saving} onClick={cancelEdit}>
                        {LABELS.cancel}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-[0.9375rem] font-medium text-ink">{banner.title}</p>
                      <p className="text-[0.8125rem] text-ink-muted">
                        {banner.status} · {banner.linkType} · {LABELS.promoBannerPriority}{' '}
                        {banner.priority}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(banner)}>
                        {LABELS.editPromoBanner}
                      </Button>
                      {banner.status !== PROMO_BANNER_STATUS.ACTIVE ? (
                        <Button size="sm" variant="outline" onClick={() => void onActivate(banner)}>
                          {PROMO_BANNER_STATUS.ACTIVE}
                        </Button>
                      ) : null}
                      <Button size="sm" variant="outline" onClick={() => void onDelete(banner)}>
                        {LABELS.delete}
                      </Button>
                    </div>
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
