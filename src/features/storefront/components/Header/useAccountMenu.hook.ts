import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LABELS, ROLES } from "@/shared/constants/labels";
import {
  accountSectionsForRole,
  workspaceAccountSections,
} from "@/features/account";
import { profilePathForRole } from "@/shared/utils/profilePaths";
import {
  isVendorWorkspacePath,
  isWorkspacePath,
} from "@/shared/utils/roleSurface";
import { isWorkspaceRole } from "@/shared/utils/roles";
import { PATHS } from "@/shared/constants/paths";
import type { CurrentUser } from "@/shared/api/types";

export function useAccountMenu(currentUser: CurrentUser | null) {
  const pathname = usePathname();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [canHoverAccountMenu, setCanHoverAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const fallbackLabel = useMemo(() => {
    if (!currentUser?.name) return LABELS.profile;
    const initials = currentUser.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
    return initials || LABELS.profile;
  }, [currentUser?.name]);

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
    return sections.map((section) => ({
      href: profilePathForRole(roleForPaths, section.id),
      label: section.label,
    }));
  }, [currentUser, pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncHoverCapability = () =>
      setCanHoverAccountMenu(mediaQuery.matches);

    syncHoverCapability();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncHoverCapability);
      return () =>
        mediaQuery.removeEventListener("change", syncHoverCapability);
    }

    mediaQuery.addListener(syncHoverCapability);
    return () => mediaQuery.removeListener(syncHoverCapability);
  }, []);

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
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [accountMenuOpen]);

  return {
    accountMenuOpen,
    setAccountMenuOpen,
    canHoverAccountMenu,
    accountMenuRef,
    fallbackLabel,
    accountLinks,
  };
}
