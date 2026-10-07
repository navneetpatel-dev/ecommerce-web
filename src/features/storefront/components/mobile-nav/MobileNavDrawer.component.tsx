import { useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS, ROLES } from "@/shared/constants/labels";
import { giftCardsLabels } from "@/shared/constants/labels/giftCards";
import type { Category, CurrentUser } from "@/shared/api/types";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { useIsAuthenticated } from "@/shared/hooks/auth/useRequireAuth.hook";
import { useModalOverlay } from "@/shared/hooks/ui/useModalOverlay.hook";
import { MobileNavCategoryTree } from "./MobileNavCategoryTree.component";
import { MobileNavPrimaryLinks } from "./MobileNavPrimaryLinks.component";
import { mobileNavDrawerStyles as styles } from "../../styles/mobile-nav/mobileNavDrawer.styles";

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  currentUser: CurrentUser | null;
  categories: Category[];
}

/**
 * Lightweight drawer categories in the navbar's tile language: each department renders as a
 * tile with a brand icon square and its children as pills, so the drawer looks like the mega
 * menu it mirrors without inheriting its wide-panel spacing (Rule 5: one look per concept).
 */
export function MobileNavDrawer({
  open,
  onClose,
  currentUser,
  categories,
}: MobileNavDrawerProps) {
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const isAuthenticated = useIsAuthenticated();
  const panelRef = useRef<HTMLDivElement>(null);
  useModalOverlay({ open, onClose, panelRef });

  if (!open) return null;

  return (
    <div className={styles.overlayWrapper}>
      {/* Hidden, untabbable close target: click-outside still closes, without a
          click handler on a static element. */}
      <Button
        type="button"
        variant="ghost"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={styles.backdrop}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={LABELS.menu}
        className={styles.drawer}
      >
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
          <MobileNavPrimaryLinks onNavigate={onClose} />

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
                href={PATHS.myReturns}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.returnsPageTitle}
              </Link>
              <Link
                href={PATHS.reviews}
                onClick={onClose}
                className={styles.accountLink}
              >
                {LABELS.reviews}
              </Link>
              <Link
                href={PATHS.giftCards}
                onClick={onClose}
                className={styles.accountLink}
              >
                {giftCardsLabels.giftCards}
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
