"use client";

import { useRoleSurfaceGate } from "@/shared/hooks/useRoleSurfaceGate";

/**
 * Enforces role surfaces for every route (see `useRoleSurfaceGate`).
 * Presentational shell: calls the gate hook and renders children only when
 * the current role may view this surface (Rule 1).
 */
export function RoleSurfaceGuard({ children }: { children: React.ReactNode }) {
  const { shouldRender } = useRoleSurfaceGate();

  if (!shouldRender) return null;
  return <>{children}</>;
}
