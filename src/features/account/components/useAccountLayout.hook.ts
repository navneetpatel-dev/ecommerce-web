"use client";

import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles";
import type { AccountNavItem, AccountSectionId } from "../types";

interface UseAccountLayoutParams {
  sections: AccountNavItem[];
  activeSection: AccountSectionId;
}

export function useAccountLayout({
  sections,
  activeSection,
}: UseAccountLayoutParams) {
  const role = useAuthStore((s) => s.currentUser?.role);
  const isWorkspace = isWorkspaceRole(role);

  const active = useMemo(
    () => sections.find((s) => s.id === activeSection) ?? sections[0]!,
    [sections, activeSection],
  );

  const settingsHint = isWorkspace
    ? LABELS.accountSettingsHintWorkspace
    : LABELS.accountSettingsHintCustomer;

  return {
    isWorkspace,
    active,
    settingsHint,
  };
}
