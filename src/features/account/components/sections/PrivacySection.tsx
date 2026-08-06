'use client'

import { useState } from 'react'
import { Download, LogOut, Moon, Sun, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { FormError } from '@/shared/components/FormError'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/api/auth.queries'
import { useQueryClient } from '@tanstack/react-query'
import { useTheme } from '@/shared/hooks/use-theme'
import { useDeleteAccount, useExportAccount } from '../../api/account.queries'

export function PrivacySection() {
  const [confirmOpen, setConfirmOpen] = useState(false)
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
    setConfirmOpen(false)
    router.replace('/')
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
    <div className="space-y-4">
      <section className="border border-line bg-surface p-5 shadow-elevation-1 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
            {theme === 'dark' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[1.125rem] text-ink">Appearance</h2>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              Choose light or dark for the storefront. Saved on this device.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
          </div>
        </div>
      </section>

      <section className="border border-line bg-surface p-5 shadow-elevation-1 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
            <Download size={18} strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[1.125rem] text-ink">Download my data</h2>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              Export a JSON copy of your profile, addresses, orders, reviews, returns, and
              wishlist.
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                loading={exportAccount.isPending}
                onClick={() => void handleExport()}
              >
                <Download size={16} />
                Download my data
              </Button>
            </div>
            <FormError
              error={exportAccount.error as Error | null}
              fallback="Could not export account data."
            />
          </div>
        </div>
      </section>

      <section className="border border-line bg-surface p-5 shadow-elevation-1 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
            <LogOut size={18} strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[1.125rem] text-ink">Sign out</h2>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              End this session on this device from inside your account settings.
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                loading={logout.isPending}
                onClick={() => logout.mutate()}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-line border-danger/30 bg-surface p-5 shadow-elevation-1 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-danger">
            <Trash2 size={18} strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[1.125rem] text-ink">Delete account</h2>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              Permanently deactivate your account. This cannot be undone from the storefront.
            </p>
            <Button
              type="button"
              variant="destructive"
              className="mt-4 gap-2"
              onClick={() => {
                setConfirmText('')
                setConfirmOpen(true)
              }}
            >
              <Trash2 size={16} />
              Delete account
            </Button>
          </div>
        </div>
      </section>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open)
          if (!open) setConfirmText('')
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              Type <span className="font-semibold text-ink">DELETE</span> to confirm. Your profile
              will be deactivated and you&apos;ll be signed out.
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!canConfirm}
              loading={deleteAccount.isPending}
              onClick={() => void handleDelete()}
            >
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
