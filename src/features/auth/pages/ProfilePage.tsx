'use client'

import { useProfilePage } from '../hooks/useProfilePage'
import { ChangePasswordSection } from '../components/ChangePasswordSection'

export function ProfilePage() {
  const profile = useProfilePage()

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="font-display text-[1.75rem] font-semibold text-ink">Account Settings</h1>
      <ChangePasswordSection
        form={profile.form}
        onSubmit={profile.onSubmit}
        error={profile.error}
        isPending={profile.isPending}
        isSuccess={profile.isSuccess}
      />
    </div>
  )
}
