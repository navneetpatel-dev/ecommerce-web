import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import type { Category, CurrentUser } from '@/shared/api/types'
import { resolveCategoryIcon } from '@/features/categories'

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?sort=newest', label: 'New Arrivals' },
]

interface MobileNavDrawerProps {
  open: boolean
  onClose: () => void
  currentUser: CurrentUser | null
  categories: Category[]
  onLogout: () => void
}

export function MobileNavDrawer({
  open,
  onClose,
  currentUser,
  categories,
  onLogout,
}: MobileNavDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-overlay animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface shadow-elevation-4 animate-slide-in-left flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b border-line">
          <span className="text-[1.125rem] font-semibold text-brand">Menu</span>
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

          <div className="mt-4 px-3 py-2 flex items-center justify-between">
            <span className="text-[0.8125rem] font-medium text-ink-muted">Categories</span>
            {categories.length > 0 ? (
              <Link
                href="/categories"
                onClick={onClose}
                className="inline-flex items-center gap-0.5 text-[0.75rem] font-medium text-brand"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            ) : null}
          </div>

          {categories.length === 0 ? (
            <p className="px-3 py-2 text-[0.8125rem] text-ink-faint">No categories yet</p>
          ) : (
            <ul className="space-y-0.5">
              {categories.map((category) => {
                const Icon = resolveCategoryIcon(category)
                return (
                  <li key={category.id}>
                    <Link
                      href={`/products?categoryId=${category.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.9375rem] font-medium hover:bg-paper transition-colors"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-ink-muted" strokeWidth={1.5} />
                      <span className="truncate">{category.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {currentUser && currentUser.role === 'CUSTOMER' && (
            <>
              <div className="px-3 py-2 text-[0.8125rem] font-medium text-ink-muted mt-4">Account</div>
              <Link href="/orders" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Orders</Link>
              <Link href="/wishlist" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Wishlist</Link>
              <Link href="/wallet" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Wallet</Link>
              <Link href="/profile" onClick={onClose} className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors">Profile</Link>
            </>
          )}

          {currentUser && (
            <button
              onClick={() => {
                onLogout()
                onClose()
              }}
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
