'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Camera, CheckCircle2, ChevronRight, Heart, LifeBuoy, Package } from 'lucide-react'
import { motion } from 'motion/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { FormError } from '@/shared/components/FormError'
import { ImageCropDialog } from '@/shared/components/ImageCropDialog'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Button } from '@/shared/components/ui/button'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import type { ImageMimeType } from '@/shared/constants/imageSpecs'
import { getImageUploadSpec } from '@/shared/constants/imageSpecs'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'
import { formatLabel } from '@/shared/utils/formatLabel'
import { normalizeImageMimeType } from '@/shared/utils/imageProcessing'
import { formatOrderDate } from '@/features/orders/utils/format'
import { readFileAsDataUrl } from '@/features/uploads/api/uploads.queries'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { useAccountOverview } from '../../hooks/useAccountOverview'
import { useUploadAvatar } from '../../api/account.queries'
import type { AccountSectionId } from '../../types'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
}

interface OverviewSectionProps {
  onNavigate: (id: AccountSectionId) => void
}

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  const {
    profile,
    isLoadingProfile,
    profileError,
    ordersCount,
    wishlistCount,
    isLoadingStats,
  } = useAccountOverview()
  const uploadAvatar = useUploadAvatar()
  const fileRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropFilename, setCropFilename] = useState('avatar.jpg')
  const [cropMimeType, setCropMimeType] = useState<ImageMimeType>('image/jpeg')
  const avatarSpec = getImageUploadSpec(UPLOAD_ENTITY.USERS, UPLOAD_PURPOSE.AVATAR)

  if (isLoadingProfile) {
    return (
      <div className="space-y-4 border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    )
  }

  if (profileError || !profile) {
    return (
      <div className="border border-line bg-surface px-5 py-10 text-center">
        <p className="text-[0.9375rem] text-ink-muted">
          {profileError?.message || 'Could not load your profile. Please try again.'}
        </p>
      </div>
    )
  }

  const memberSince = profile.createdAt ? formatOrderDate(profile.createdAt) : null
  const avatarSrc = profile.avatarUrl || undefined

  const onPickFile = (file: File | null) => {
    if (!file || !avatarSpec) return
    if (!file.type.startsWith('image/')) {
      setLocalError(LABELS.uploadInvalidImageType)
      return
    }
    if (file.size > avatarSpec.maxBytes) {
      setLocalError(formatLabel(LABELS.uploadTooLargeMb, { mb: '1.5' }))
      return
    }
    setLocalError(null)
    setCropFilename(file.name)
    setCropMimeType(normalizeImageMimeType(file))
    setCropSrc(URL.createObjectURL(file))
    if (fileRef.current) fileRef.current.value = ''
  }

  const onAvatarCropped = async (file: File) => {
    setLocalError(null)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      await uploadAvatar.mutateAsync({
        userId: profile.id,
        dataUrl,
        filename: file.name,
      })
    } catch (err) {
      setLocalError(getApiErrorMessage(err, LABELS.uploadFailed))
    } finally {
      if (cropSrc) URL.revokeObjectURL(cropSrc)
      setCropSrc(null)
    }
  }

  const onAvatarCropCancelled = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        className="relative border border-line bg-surface p-6 shadow-elevation-1 md:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
        />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative inline-flex shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="group relative h-auto min-h-0 max-h-none w-auto rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label={LABELS.uploadProfilePhoto}
            >
              <Avatar className="h-24 w-24 border border-line text-[1.25rem] font-semibold text-ink">
                {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
                <AvatarFallback className="bg-brand-subtle text-ink">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center border border-line bg-surface text-ink-muted transition-colors group-hover:text-brand">
                <Camera size={14} strokeWidth={1.5} />
              </span>
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="min-w-0">
            <TextEyebrow brand>Profile</TextEyebrow>
            <h2
              className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
              style={{ fontSize: 'var(--text-display-sm)' }}
            >
              {profile.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-[0.9375rem] text-ink-muted">{profile.email}</p>
              {profile.emailVerified ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 size={12} />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">Unverified</Badge>
              )}
            </div>
            {memberSince ? (
              <p className="mt-2 text-[0.8125rem] text-ink-faint">Member since {memberSince}</p>
            ) : null}
            <p className="mt-3 text-[0.8125rem] text-ink-muted">{LABELS.uploadProfilePhotoHint}</p>
            <FormError
              error={
                (uploadAvatar.error as Error | null) ??
                (localError ? new Error(localError) : null)
              }
              fallback={LABELS.uploadFailed}
            />
          </div>
        </div>
      </motion.section>

      {avatarSpec && cropSrc ? (
        <ImageCropDialog
          open
          imageSrc={cropSrc}
          aspectRatio={avatarSpec.aspectRatio}
          outputWidth={avatarSpec.outputWidth}
          outputHeight={avatarSpec.outputHeight}
          sourceFilename={cropFilename}
          mimeType={cropMimeType}
          onOpenChange={(open) => {
            if (!open) onAvatarCropCancelled()
          }}
          onConfirm={onAvatarCropped}
        />
      ) : null}

      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="border-b border-line px-5 py-4 md:px-6">
          <TextEyebrow>At a glance</TextEyebrow>
          <p className="mt-1 text-[0.875rem] text-ink-muted">Jump into what matters most.</p>
        </div>
        <ul className="divide-y divide-line">
          <GlanceRow
            icon={Package}
            label="Orders"
            value={isLoadingStats ? '—' : String(ordersCount)}
            onDetails={() => onNavigate('orders')}
          />
          <GlanceRow
            icon={Heart}
            label="Wishlist"
            value={isLoadingStats ? '—' : String(wishlistCount)}
            href={PATHS.wishlist}
          />
          <GlanceRow
            icon={LifeBuoy}
            label={LABELS.overviewSupportTickets}
            value={LABELS.view}
            href={PATHS.supportTickets}
          />
          <GlanceRow
            icon={LifeBuoy}
            label={LABELS.overviewBugReports}
            value={LABELS.reportABug}
            href={PATHS.bugReports}
          />
        </ul>
      </section>
    </div>
  )
}

function GlanceRow({
  icon: Icon,
  label,
  value,
  href,
  onDetails,
}: {
  icon: typeof Package
  label: string
  value: string
  href?: string
  onDetails?: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Icon size={16} strokeWidth={1.5} className="shrink-0 text-ink-muted" aria-hidden />
        <div className="min-w-0">
          <p className="text-[0.9375rem] text-ink">{label}</p>
          <p className="mt-0.5 font-display text-[1.25rem] tabular-nums text-ink">{value}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {onDetails ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onDetails}
            className="h-auto min-h-0 max-h-none gap-1 px-0 py-0 text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
          >
            {LABELS.details}
            <ChevronRight size={14} />
          </Button>
        ) : href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
          >
            {LABELS.view}
            <ChevronRight size={14} />
          </Link>
        ) : null}
      </div>
    </li>
  )
}
