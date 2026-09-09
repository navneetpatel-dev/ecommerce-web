"use client";

import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles/roles";
import { usePersonalInfoForm } from "../../../hooks/personal-info/usePersonalInfoForm.hook";

export function usePersonalInfoSection() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isWorkspace = isWorkspaceRole(currentUser?.role);
  const formState = usePersonalInfoForm();

  return {
    ...formState,
    isWorkspace,
  };
}
