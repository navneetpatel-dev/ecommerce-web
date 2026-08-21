import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/shared/constants/paths";
import { LABELS, ROLES } from "@/shared/constants/labels";
import type { Category, CurrentUser } from "@/shared/api/types";
import { resolveCategoryIcon, categoryHref } from "@/features/categories";
import { cn } from "@/shared/utils/cn";

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
              className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] font-medium hover:bg-paper transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 px-3 py-2 flex items-center justify-between">
            <span className="text-[0.8125rem] font-medium text-ink-muted">
              {LABELS.categories}
            </span>
            {categories.length > 0 ? (
              <Link
                href={PATHS.categories}
                onClick={onClose}
                className="inline-flex items-center gap-0.5 text-[0.75rem] font-medium text-brand"
              >
                {LABELS.viewAll} <ArrowRight className="h-3 w-3" />
              </Link>
            ) : null}
          </div>

          {categories.length === 0 ? (
            <p className="px-3 py-2 text-[0.8125rem] text-ink-faint">
              {LABELS.noCategoriesYet}
            </p>
          ) : (
            <ul className="space-y-1">
              {categories.map((department) => {
                const Icon = resolveCategoryIcon(department);
                return (
                  <li key={department.id}>
                    <Link
                      href={categoryHref(department, categories)}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.9375rem] font-medium hover:bg-paper transition-colors"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-ink-muted"
                        strokeWidth={1.5}
                      />
                      <span className="truncate">{department.name}</span>
                    </Link>
                    {department.children?.length ? (
                      <ul className="ml-4 space-y-0.5 border-l border-line pl-2">
                        {department.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={categoryHref(child, categories)}
                              onClick={onClose}
                              className="block truncate rounded-md px-2 py-1.5 text-[0.8125rem] font-medium text-ink-muted hover:bg-paper hover:text-ink"
                            >
                              {child.name}
                            </Link>
                            {child.children?.length ? (
                              <ul className="ml-2 space-y-0.5">
                                {child.children.map((leaf) => (
                                  <li key={leaf.id}>
                                    <Link
                                      href={categoryHref(leaf, categories)}
                                      onClick={onClose}
                                      className={cn(
                                        "block truncate rounded-md px-2 py-1 text-[0.75rem] text-ink-faint hover:bg-paper hover:text-ink",
                                      )}
                                    >
                                      {leaf.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          {currentUser && currentUser.role === ROLES.CUSTOMER && (
            <>
              <div className="px-3 py-2 text-[0.8125rem] font-medium text-ink-muted mt-4">
                {LABELS.account}
              </div>
              <Link
                href={PATHS.orders}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors"
              >
                {LABELS.orders}
              </Link>
              <Link
                href={PATHS.wishlist}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors"
              >
                {LABELS.wishlist}
              </Link>
              <Link
                href={PATHS.wallet}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors"
              >
                {LABELS.wallet}
              </Link>
              <Link
                href={PATHS.help}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors"
              >
                {LABELS.help}
              </Link>
              <Link
                href={PATHS.profile}
                onClick={onClose}
                className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] hover:bg-paper transition-colors"
              >
                {LABELS.profile}
              </Link>
            </>
          )}

          {!currentUser && (
            <Link
              href={PATHS.login}
              onClick={onClose}
              className="flex items-center px-3 py-2.5 rounded-md text-[0.9375rem] font-medium text-brand hover:bg-brand-subtle transition-colors mt-4"
            >
              {LABELS.logIn}
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
