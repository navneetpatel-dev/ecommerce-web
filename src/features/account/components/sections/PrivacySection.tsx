'use client'

import { useState } from 'react'
import { Download, LogOut, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { FormError } from '@/shared/components/FormError'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { StatusDialog } from '@/shared/components/StatusDialog'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/api/auth.queries'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from '@/shared/hooks/use-theme'
import { PATHS } from '@/shared/constants/paths'
import { useDeleteAccount, useExportAccount } from '../../api/account.queries'

export function PrivacySection() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const deleteAccount = useDeleteAccount()
  const exportAccount = useExportAccount()
  const logout = useLogout()
  const clearSession = useAuthStore((s) => s.clearSession)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { theme, setTheme, mounted } = useTheme()

  const canConfirm = confirmText.trim().toUpperCase() === 'DELETE'

  const handleDelete = async () => {
    await deleteAccount.mutateAsync()
    clearSession()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('session')
    }
    queryClient.clear()
    setDeleteOpen(false)
    router.replace(PATHS.home)
  }

  const handleExport = async () => {
    const data = await exportAccount.mutateAsync()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `account-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="border-b border-line bg-paper/65 px-5 py-4 md:px-6">
          <TextEyebrow>Preferences</TextEyebrow>
          <h2 className="mt-1 font-display text-[1.1875rem] tracking-tight text-ink">
            Privacy & data
          </h2>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            Control appearance on this device, export your data, or end your session.
          </p>
        </div>

        <ul className="divide-y divide-line">
          <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-medium text-ink">Appearance</p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                Light or dark for the storefront. Saved on this device.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant={mounted && theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
              <Button
                type="button"
                variant={mounted && theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
            </div>
          </li>

          <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-medium text-ink">Download my data</p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                Export a JSON copy of your profile, addresses, orders, reviews, returns, and
                wishlist.
              </p>
              <FormError
                error={exportAccount.error as Error | null}
                fallback="Could not export account data."
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              loading={exportAccount.isPending}
              onClick={() => void handleExport()}
            >
              <Download size={14} strokeWidth={1.5} />
              Download
            </Button>
          </li>

          <li className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-medium text-ink">Sign out</p>
              <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                End this session on this device.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut size={14} strokeWidth={1.5} />
              Sign out
            </Button>
          </li>
        </ul>
      </section>

      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="border-b border-line px-5 py-4 md:px-6">
          <TextEyebrow>Danger zone</TextEyebrow>
          <h2 className="mt-1 font-display text-[1.1875rem] tracking-tight text-ink">
            Delete account
          </h2>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            Permanently deactivate your account. This cannot be undone from the storefront.
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p className="text-[0.8125rem] leading-6 text-ink-muted">
            Your profile will be deactivated and you&apos;ll be signed out immediately.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="shrink-0 gap-2"
            onClick={() => {
              setConfirmText('')
              setDeleteOpen(true)
            }}
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Delete account
          </Button>
        </div>
      </section>

      <StatusDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        variant="warning"
        icon={LogOut}
        title="Sign out?"
        description="You'll need to sign in again to access your account on this device."
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setLogoutOpen(false),
        }}
        primaryAction={{
          label: 'Sign out',
          loading: logout.isPending,
          onClick: () => logout.mutate(),
        }}
      />

      <StatusDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setConfirmText('')
        }}
        variant="danger"
        icon={Trash2}
        title="Delete your account?"
        description={
          <>
            Type <span className="font-semibold text-ink">DELETE</span> to confirm. Your profile
            will be deactivated and you&apos;ll be signed out.
          </>
        }
        secondaryAction={{
          label: 'Cancel',
          onClick: () => setDeleteOpen(false),
        }}
        primaryAction={{
          label: 'Delete account',
          variant: 'destructive',
          disabled: !canConfirm,
          loading: deleteAccount.isPending,
          onClick: () => void handleDelete(),
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="delete-confirm">Confirmation</Label>
          <Input
            id="delete-confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            autoComplete="off"
          />
        </div>
        <FormError
          error={deleteAccount.error as Error | null}
          fallback="Could not delete account."
        />
      </StatusDialog>
    </div>
  )
}
