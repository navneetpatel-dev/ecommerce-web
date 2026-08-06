'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Camera, CheckCircle2, ChevronRight, Heart, Package, Wallet } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { FormError } from '@/shared/components/FormError'
import { formatOrderDate, formatInr } from '@/features/orders/utils/format'
import { useAccountOverview } from '../../hooks/useAccountOverview'
import { useUploadAvatar } from '../../api/account.queries'
import type { AccountSectionId } from '../../types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase()
}

function resolveAvatarUrl(url: string | null | undefined) {
  if (!url) return undefined
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `${API_BASE}${url}`
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
    walletBalance,
    isLoadingStats,
  } = useAccountOverview()
  const uploadAvatar = useUploadAvatar()
  const fileRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  if (isLoadingProfile) {
    return (
      <div className="space-y-4 border border-line bg-surface-raised p-6">
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
      <div className="border border-line bg-surface-raised px-5 py-10 text-center">
        <p className="text-[0.9375rem] text-ink-muted">
          {profileError?.message || 'Could not load your profile. Please try again.'}
        </p>
      </div>
    )
  }

  const memberSince = profile.createdAt ? formatOrderDate(profile.createdAt) : null
  const avatarSrc = resolveAvatarUrl(profile.avatarUrl)

  const onPickFile = async (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setLocalError('Please choose a PNG, JPEG, or WebP image.')
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setLocalError('Image must be under 1.5MB.')
      return
    }
    setLocalError(null)
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result ?? '')
      uploadAvatar.mutate(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div className="border border-line bg-surface-raised p-6 shadow-elevation-1">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative inline-flex shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadAvatar.isPending}
              className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Upload profile photo"
            >
              <Avatar className="h-24 w-24 border border-line text-[1.25rem] font-semibold text-ink">
                {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
                <AvatarFallback className="bg-brand-subtle text-ink">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors group-hover:text-brand">
                <Camera size={14} />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="min-w-0">
            <h2 className="font-display text-[1.5rem] text-ink">{profile.name}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
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
            <FormError
              error={(uploadAvatar.error as Error | null) ?? (localError ? new Error(localError) : null)}
              fallback="Could not upload photo."
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatLink
          icon={Package}
          label="Orders"
          value={isLoadingStats ? '—' : String(ordersCount)}
          href="/orders"
          onQuick={() => onNavigate('orders')}
        />
        <StatLink
          icon={Heart}
          label="Wishlist"
          value={isLoadingStats ? '—' : String(wishlistCount)}
          href="/wishlist"
        />
        <StatLink
          icon={Wallet}
          label="Wallet"
          value={isLoadingStats ? '—' : formatInr(walletBalance)}
          href="/wallet"
          onQuick={() => onNavigate('orders')}
        />
      </div>
    </div>
  )
}

function StatLink({
  icon: Icon,
  label,
  value,
  href,
  onQuick,
}: {
  icon: typeof Package
  label: string
  value: string
  href: string
  onQuick?: () => void
}) {
  return (
    <div className="border border-line bg-surface-raised p-4 transition-colors hover:border-ink/25">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center border border-line bg-paper text-brand">
          <Icon size={16} strokeWidth={1.5} />
        </span>
        {onQuick ? (
          <button
            type="button"
            onClick={onQuick}
            className="text-[0.75rem] font-medium text-ink-muted hover:text-brand"
          >
            Details
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
        {label}
      </p>
      <p className="mt-1 font-display text-[1.375rem] tabular-nums text-ink">{value}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand hover:text-brand-hover"
      >
        View
        <ChevronRight size={14} />
      </Link>
    </div>
  )
}
