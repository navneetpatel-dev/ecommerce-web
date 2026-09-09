import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths";
import { LABELS, ROLES } from "@/shared/constants/labels";
import type { Category, CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useIsAuthenticated } from "@/shared/hooks/useRequireAuth.hook";
import { MobileNavCategoryTree } from "./MobileNavCategoryTree.component";

const navLinks = [
  { href: PATHS.products, label: LABELS.allProducts },
  { href: PATHS.productsNewest, label: LABELS.newArrivals },
];

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  currentUser: CurrentUser | null;
  categories: Category[];
}

/**
 * Mobile category nav — mirrors mega menu depth (Department → Category → Subcategory).
 */
export function MobileNavDrawer({
  open,
  onClose,
  currentUser,
  categories,
}: MobileNavDrawerProps) {
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const isAuthenticated = useIsAuthenticated();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div
        className="absolute inset-0 bg-overlay animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface shadow-elevation-4 animate-slide-in-left flex flex-col">
        <div className="flex items-center justify-between px-4 h-14 border-b border-line">
          <span className="text-[1.125rem] font-semibold text-brand">
            {LABELS.menu}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-ink-muted"
            aria-label={LABELS.closeMenu}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-md text-body font-medium hover:bg-paper transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <MobileNavCategoryTree categories={categories} onNavigate={onClose} />

          {!authBootstrapped ? (
            <div className="mt-4 space-y-2 px-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : null}

          {authBootstrapped &&
          isAuthenticated &&
          currentUser &&
          currentUser.role === ROLES.CUSTOMER ? (
            <>
              <div className="px-3 py-2 text-body-sm font-medium text-ink-muted mt-4">
                {LABELS.account}
              </div>
              <Link
                href={PATHS.orders}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-body hover:bg-paper transition-colors"
              >
                {LABELS.orders}
              </Link>
              <Link
                href={PATHS.wishlist}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-body hover:bg-paper transition-colors"
              >
                {LABELS.wishlist}
              </Link>
              <Link
                href={PATHS.wallet}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-body hover:bg-paper transition-colors"
              >
                {LABELS.wallet}
              </Link>
              <Link
                href={PATHS.help}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-body hover:bg-paper transition-colors"
              >
                {LABELS.help}
              </Link>
              <Link
                href={PATHS.profile}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-body hover:bg-paper transition-colors"
              >
                {LABELS.profile}
              </Link>
            </>
          ) : null}

          {authBootstrapped && !isAuthenticated ? (
            <Link
              href={PATHS.login}
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-md text-body font-medium text-brand hover:bg-brand-subtle transition-colors mt-4"
            >
              {LABELS.logIn}
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
