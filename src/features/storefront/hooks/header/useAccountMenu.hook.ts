import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LABELS, ROLES } from "@/shared/constants/labels";
import {
  accountSectionsForRole,
  workspaceAccountSections,
} from "@/features/account";
import { profilePathForRole } from "@/shared/utils/navigation/profilePaths";
import {
  isVendorWorkspacePath,
  isWorkspacePath,
} from "@/shared/utils/roles/roleSurface";
import { isWorkspaceRole } from "@/shared/utils/roles/roles";
import { PATHS } from "@/shared/constants/paths/paths";
import type { CurrentUser } from "@/shared/api/types";
import { useLogout } from "@/features/auth";
import {
  SHOPPER_MENU_GROUPS,
  type AccountMenuGroup,
} from "../../constants/header/accountMenuGroups";

export function useAccountMenu(currentUser: CurrentUser | null) {
  const pathname = usePathname();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const logout = useLogout();

  const userName = currentUser?.name;
  const fallbackLabel = useMemo(() => {
    if (!userName) return LABELS.profile;
    const initials = userName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    return initials || LABELS.profile;
  }, [userName]);

  const accountLinks = useMemo(() => {
    if (!currentUser) return [];
    const onWorkspace =
      isWorkspaceRole(currentUser.role) || isWorkspacePath(pathname);
    const sections = onWorkspace
      ? workspaceAccountSections()
      : accountSectionsForRole(currentUser.role);
    const roleForPaths = isWorkspaceRole(currentUser.role)
      ? currentUser.role
      : pathname.startsWith(PATHS.admin.root)
        ? ROLES.SUPER_ADMIN
        : isVendorWorkspacePath(pathname)
          ? ROLES.VENDOR_OWNER
          : currentUser.role;
    const accountGroup: AccountMenuGroup = {
      title: LABELS.accountMenuAccount,
      // Shoppers reach orders from the Shopping group, so the profile tab is not repeated.
      links: sections
        .filter((section) => onWorkspace || section.id !== "orders")
        .map((section) => ({
          href: profilePathForRole(roleForPaths, section.id),
          label: section.label,
        })),
    };
    // Shoppers get their orders, money and help pages too; staff keep the profile list.
    return onWorkspace
      ? [accountGroup]
      : [...SHOPPER_MENU_GROUPS, accountGroup];
  }, [currentUser, pathname]);

  useEffect(() => {
    if (!accountMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [accountMenuOpen]);

  const toggleAccountMenu = useCallback(
    () => setAccountMenuOpen((open) => !open),
    [],
  );
  const closeAccountMenu = useCallback(() => setAccountMenuOpen(false), []);
  const signOut = useCallback(() => {
    setAccountMenuOpen(false);
    logout.mutate();
  }, [logout]);

  // Opens on click only. Opening on hover meant the click that followed
  // toggled it straight shut, and hover does nothing on touch screens.
  return {
    accountMenuOpen,
    setAccountMenuOpen,
    toggleAccountMenu,
    closeAccountMenu,
    accountMenuRef,
    triggerRef,
    fallbackLabel,
    accountGroups: accountLinks,
    signOut,
    isSigningOut: logout.isPending,
  };
}
