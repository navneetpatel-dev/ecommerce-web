'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormField } from '@/shared/components/FormField'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import {
  useAccountProfile,
  useUpdateProfile,
  useConfirmEmail,
} from '../../api/account.queries'
import type { UpdateProfileResult } from '@/features/users/api/users.api'

interface PersonalForm {
  name: string
  phone: string
  email: string
}

export function PersonalInfoSection() {
  const { data: profile, isLoading, isError, error } = useAccountProfile()
  const updateProfile = useUpdateProfile()
  const confirmEmail = useConfirmEmail()
  const [verifyToken, setVerifyToken] = useState('')
  const [pendingToken, setPendingToken] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PersonalForm>({
    defaultValues: { name: '', phone: '', email: '' },
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        email: profile.email ?? '',
      })
    }
  }, [profile, reset])

  if (isLoading) {
    return (
      <div className="max-w-md space-y-4 border border-line bg-surface p-6">
        <Skeleton className="h-5 w-32" />
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
    <div className="max-w-md space-y-5">
      <form
        onSubmit={handleSubmit(async (data) => {
          const body: {
            name: string
            phone: string | null
            email?: string
          } = {
            name: data.name.trim(),
            phone: data.phone.trim() || null,
          }
          if (data.email.trim().toLowerCase() !== profile.email.toLowerCase()) {
            body.email = data.email.trim()
          }
          const result = (await updateProfile.mutateAsync(body)) as UpdateProfileResult
          if (result.emailVerificationToken) {
            setPendingToken(result.emailVerificationToken)
            setVerifyToken(result.emailVerificationToken)
          }
        })}
        className="space-y-5 border border-line bg-surface p-5 shadow-elevation-1 md:p-6"
      >
        <div>
          <TextEyebrow className="hidden lg:block">Identity</TextEyebrow>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            Update how we address you and how we can reach you.
          </p>
        </div>

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
          helperText="Optional — used for delivery updates."
        />

        <FormField
          id="account-email"
          label="Email"
          type="email"
          registration={register('email', { required: 'Email is required' })}
          error={errors.email}
          helperText={
            profile.pendingEmail
              ? `Pending verification for ${profile.pendingEmail}`
              : 'Changing email requires verification.'
          }
        />

        <FormError error={updateProfile.error as Error | null} fallback="Could not save profile." />
        {updateProfile.isSuccess && !isDirty ? (
          <p className="text-[0.875rem] text-success">Profile saved.</p>
        ) : null}

        <Button type="submit" loading={updateProfile.isPending} disabled={!isDirty}>
          Save changes
        </Button>
      </form>

      {(profile.pendingEmail || pendingToken) && (
        <div className="space-y-3 border border-line bg-surface p-5 shadow-elevation-1 md:p-6">
          <TextEyebrow>Verify</TextEyebrow>
          <h3 className="mt-1 text-[1.0625rem] font-semibold tracking-tight text-ink">
            Confirm email change
          </h3>
          <p className="text-[0.875rem] text-ink-muted">
            Enter the verification token for{' '}
            <span className="font-medium text-ink">{profile.pendingEmail}</span>. In development the
            token appears after you save.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="email-token">Verification token</Label>
            <Input
              id="email-token"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="Paste token"
            />
          </div>
          <FormError
            error={confirmEmail.error as Error | null}
            fallback="Could not verify email."
          />
          {confirmEmail.isSuccess ? (
            <p className="text-[0.875rem] text-success">Email updated.</p>
          ) : null}
          <Button
            type="button"
            loading={confirmEmail.isPending}
            disabled={!verifyToken.trim()}
            onClick={() => confirmEmail.mutate(verifyToken.trim())}
          >
            Confirm email
          </Button>
        </div>
      )}
    </div>
  )
}
