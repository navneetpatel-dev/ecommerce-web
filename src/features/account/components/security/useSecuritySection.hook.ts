"use client";

import { useMemo, useState } from "react";
import {
  useProfilePage,
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "@/features/auth";
import { formatSessionDateTime } from "@/shared/utils/formatting/formatDate";

export interface SessionViewModel {
  family: string;
  device: string;
  isCurrent: boolean;
  ip: string;
  lastUsedAt: string;
  formattedLastActive: string;
}

function getDeviceLabel(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  const ua = userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad")) return "Apple device";
  if (ua.includes("android")) return "Android device";
  if (ua.includes("mac")) return "Mac";
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("linux")) return "Linux";
  return "Browser session";
}

export function useSecuritySection() {
  const profile = useProfilePage();
  const sessions = useSessions();
  const revoke = useRevokeSession();
  const revokeOthers = useRevokeOtherSessions();

  const [revokeOthersOpen, setRevokeOthersOpen] = useState(false);
  const [revokeFamily, setRevokeFamily] = useState<string | null>(null);

  const list = useMemo(() => sessions.data ?? [], [sessions.data]);
  const hasOthers = list.some((s) => !s.isCurrent);
  const revokeTarget = list.find((s) => s.family === revokeFamily) ?? null;

  const sessionViewModels = useMemo<SessionViewModel[]>(() => {
    return list.map((session) => ({
      family: session.family,
      device: getDeviceLabel(session.userAgent),
      isCurrent: session.isCurrent,
      ip: session.ipAddress || "IP unknown",
      lastUsedAt: session.lastUsedAt,
      formattedLastActive: formatSessionDateTime(session.lastUsedAt),
    }));
  }, [list]);

  const handleOpenRevokeOthers = () => {
    setRevokeOthersOpen(true);
  };

  const handleCloseRevokeOthers = () => {
    setRevokeOthersOpen(false);
  };

  const handleConfirmRevokeOthers = () => {
    revokeOthers.mutate(undefined, {
      onSuccess: () => setRevokeOthersOpen(false),
    });
  };

  const handleOpenRevokeSession = (family: string) => {
    setRevokeFamily(family);
  };

  const handleCloseRevokeSession = () => {
    setRevokeFamily(null);
  };

  const handleConfirmRevokeSession = () => {
    if (!revokeFamily) return;
    revoke.mutate(revokeFamily, {
      onSuccess: () => setRevokeFamily(null),
    });
  };

  const targetDeviceName = revokeTarget
    ? getDeviceLabel(revokeTarget.userAgent)
    : "this device";

  const sessionError = (revoke.error || revokeOthers.error) as Error | null;

  return {
    profile,
    sessions,
    sessionViewModels,
    hasOthers,
    revokeOthersOpen,
    isRevokingOthers: revokeOthers.isPending,
    revokeFamily,
    isRevokingSession: revoke.isPending,
    targetDeviceName,
    sessionError,
    handleOpenRevokeOthers,
    handleCloseRevokeOthers,
    handleConfirmRevokeOthers,
    handleOpenRevokeSession,
    handleCloseRevokeSession,
    handleConfirmRevokeSession,
  };
}
