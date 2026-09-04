"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";
import { isCustomerRole, isWorkspaceRole } from "@/shared/utils/roles";
import {
  isWorkspaceProfilePath,
  profileBasePathForRole,
  profilePathForRole,
} from "@/shared/utils/profilePaths";
import { PATHS } from "@/shared/constants/paths";
import {
  ACCOUNT_SECTIONS,
  DEFAULT_ACCOUNT_SECTION,
  DEFAULT_WORKSPACE_ACCOUNT_SECTION,
  accountSectionsForRole,
  deliveryAccountSections,
  isAccountSectionId,
  workspaceAccountSections,
} from "../constants";
import type { AccountSectionId } from "../types";

function isAnyProfilePath(pathname: string) {
  return pathname === PATHS.profile || isWorkspaceProfilePath(pathname);
}

export function useAccountPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const currentUser = useAuthStore((s) => s.currentUser);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const role = currentUser?.role;
  const onWorkspaceProfileSurface =
    isWorkspaceProfilePath(pathname) || isWorkspaceRole(role);

  const sections = useMemo(() => {
    if (isWorkspaceRole(role)) return accountSectionsForRole(role);
    if (onWorkspaceProfileSurface) {
      if (pathname.startsWith(PATHS.delivery.root)) {
        return deliveryAccountSections();
      }
      return workspaceAccountSections();
    }
    if (!authBootstrapped) return [];
    return accountSectionsForRole(role);
  }, [authBootstrapped, onWorkspaceProfileSurface, pathname, role]);

  const defaultSection =
    isCustomerRole(role) || (!role && !onWorkspaceProfileSurface)
      ? DEFAULT_ACCOUNT_SECTION
      : DEFAULT_WORKSPACE_ACCOUNT_SECTION;

  const tabParam = searchParams.get("tab");
  const requestedSection: AccountSectionId = isAccountSectionId(tabParam)
    ? tabParam
    : defaultSection;

  const activeSection: AccountSectionId = sections.some(
    (s) => s.id === requestedSection,
  )
    ? requestedSection
    : (sections[0]?.id ?? defaultSection);

  const setSection = useCallback(
    (id: AccountSectionId) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id === defaultSection) {
        params.delete("tab");
      } else {
        params.set("tab", id);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [defaultSection, pathname, router, searchParams],
  );

  useEffect(() => {
    if (!authBootstrapped || !role) return;
    if (!isAnyProfilePath(pathname)) return;

    const expectedBase = profileBasePathForRole(role);
    if (pathname !== expectedBase) {
      router.replace(profilePathForRole(role, tabParam));
    }
  }, [authBootstrapped, pathname, role, router, tabParam]);

  useEffect(() => {
    if (requestedSection === activeSection) return;
    if (sections.length === 0) return;
    setSection(activeSection);
  }, [activeSection, requestedSection, sections.length, setSection]);

  const activeNav = useMemo(
    () =>
      sections.find((s) => s.id === activeSection) ??
      sections[0] ??
      ACCOUNT_SECTIONS[0]!,
    [activeSection, sections],
  );

  return {
    isAuthenticated: Boolean(accessToken),
    authBootstrapped,
    currentUser,
    sections,
    activeSection,
    activeNav,
    setSection,
  };
}
