'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Mail, UserRound } from 'lucide-react'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Badge } from '@/shared/components/ui/badge'
import { LABELS } from '@/shared/constants/labels'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { isWorkspaceRole } from '@/shared/utils/roles'
import { useAccountProfile, useUpdateProfile } from '../../api/account.queries'

interface PersonalForm {
  name: string
  phone: string
}

export function PersonalInfoSection() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const isWorkspace = isWorkspaceRole(currentUser?.role)
  const { data: profile, isLoading, isError, error } = useAccountProfile()
  const updateProfile = useUpdateProfile()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalForm>({
    defaultValues: { name: '', phone: '' },
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
      })
    }
  }, [profile, reset])

  if (isLoading) {
    return (
      <div className="space-y-4 border border-line bg-surface p-6 shadow-elevation-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="border border-line bg-surface px-5 py-10 text-center">
        <p className="text-[0.9375rem] text-ink-muted">
          {(error as Error | null)?.message || 'Could not load your profile. Please try again.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
        <form
          onSubmit={handleSubmit(async (data) => {
            await updateProfile.mutateAsync({
              name: data.name.trim(),
              phone: data.phone.trim() || null,
            })
          })}
          className="border border-line bg-surface shadow-elevation-1"
        >
          <div className="border-b border-line bg-paper/65 px-5 py-4 md:px-6">
            <TextEyebrow>Identity</TextEyebrow>
            <h2 className="mt-1 font-display text-[1.1875rem] tracking-tight text-ink">
              Personal information
            </h2>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              Update how we address you and how we can reach you.
            </p>
          </div>

          <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                id="account-name"
                label="Full name"
                registration={register('name', { required: 'Name is required' })}
                error={errors.name}
              />

              <FormField
                id="account-phone"
                label="Phone"
                type="tel"
                registration={register('phone')}
                error={errors.phone}
                placeholder="+91…"
                helperText={
                  isWorkspace ? LABELS.phoneOptionalContact : LABELS.phoneOptionalDelivery
                }
              />
            </div>
            <FormError error={updateProfile.error as Error | null} fallback="Could not save profile." />
            {updateProfile.isSuccess && !isDirty ? (
              <p className="text-[0.875rem] text-success">Profile saved.</p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <p className="text-[0.8125rem] text-ink-faint">
                {isWorkspace
                  ? LABELS.personalInfoFooterWorkspace
                  : LABELS.personalInfoFooterCustomer}
              </p>
              <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
                Save changes
              </Button>
            </div>
          </div>
        </form>

        <aside className="border border-line bg-surface shadow-elevation-1">
          <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
            <TextEyebrow>Profile</TextEyebrow>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              A quick view of the details currently tied to your account.
            </p>
          </div>

          <div className="space-y-4 px-5 py-5 md:px-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
                <UserRound size={18} strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Account holder
                </p>
                <p className="mt-1 text-[0.9375rem] font-medium text-ink">{profile.name}</p>
                {profile.phone ? (
                  <p className="mt-0.5 text-[0.8125rem] text-ink-muted">{profile.phone}</p>
                ) : (
                  <p className="mt-0.5 text-[0.8125rem] text-ink-faint">No phone saved yet</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
                <Mail size={18} strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Email status
                </p>
                <p className="mt-1 break-all text-[0.9375rem] font-medium text-ink">{profile.email}</p>
                <div className="mt-2">
                  {profile.emailVerified ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 size={12} />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Unverified</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <p className="text-[0.8125rem] leading-6 text-ink-muted">
                {isWorkspace ? LABELS.emailFixedWorkspace : LABELS.emailFixedStorefront}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
