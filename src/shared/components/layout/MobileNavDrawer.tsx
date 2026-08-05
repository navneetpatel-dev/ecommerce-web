'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/api/auth.queries'

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?sort=newest', label: 'New Arrivals' },
]

export function MobileNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useLogout()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-overlay animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface shadow-elevation-4 animate-slide-in-left flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b border-line">
          <span className="font-display text-[1.125rem] font-semibold text-brand">Menu</span>
          <button onClick={onClose} className="p-1 text-ink-muted" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] font-medium hover:bg-paper transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {currentUser && currentUser.role === 'CUSTOMER' && (
            <>
              <div className="px-3 py-2 text-[0.8125rem] font-medium text-ink-muted mt-2">Account</div>
              <Link href="/orders" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Orders</Link>
              <Link href="/wishlist" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Wishlist</Link>
              <Link href="/wallet" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Wallet</Link>
              <Link href="/profile" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Profile</Link>
            </>
          )}

          {currentUser && (
            <button
              onClick={() => { logout.mutate(); onClose() }}
              className="w-full text-left flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] text-danger hover:bg-danger-subtle transition-colors mt-4"
            >
              Log out
            </button>
          )}

          {!currentUser && (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] font-medium text-brand hover:bg-brand-subtle transition-colors mt-4"
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
