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
import { mobileNavDrawerStyles as styles } from "./mobileNavDrawer.styles";

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
    <div className={styles.overlayWrapper}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <span className={styles.title}>{LABELS.menu}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className={styles.closeButton}
            aria-label={LABELS.closeMenu}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={styles.navLink}
            >
              {link.label}
            </Link>
          ))}

          <MobileNavCategoryTree categories={categories} onNavigate={onClose} />

          {!authBootstrapped ? (
            <div className={styles.skeletonWrapper}>
              <Skeleton className={styles.skeletonTitle} />
              <Skeleton className={styles.skeletonItem} />
              <Skeleton className={styles.skeletonItem} />
            </div>
          ) : null}

          {authBootstrapped &&
          isAuthenticated &&
          currentUser &&
          currentUser.role === ROLES.CUSTOMER ? (
            <>
              <div className={styles.accountHeading}>{LABELS.account}</div>
              <Link
                href={PATHS.orders}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.orders}
              </Link>
              <Link
                href={PATHS.wishlist}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.wishlist}
              </Link>
              <Link
                href={PATHS.wallet}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.wallet}
              </Link>
              <Link
                href={PATHS.help}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.help}
              </Link>
              <Link
                href={PATHS.profile}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.profile}
              </Link>
            </>
          ) : null}

          {authBootstrapped && !isAuthenticated ? (
            <Link
              href={PATHS.login}
              onClick={onClose}
              className={styles.loginLink}
            >
              {LABELS.logIn}
            </Link>
          ) : null}
        </nav>
      </div>
    </div>
  );
}
