"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "../api/auth.queries";

/** How long we'll wait for the verify request before offering a manual retry. */
const VERIFY_TIMEOUT_MS = 15_000;

export type VerifyEmailStatus =
  "missing-token" | "verifying" | "success" | "error" | "timeout";

/**
 * Click-only by design: the link's signed, time-limited token is itself
 * proof of mailbox ownership — verification doesn't require an active
 * session, since the person clicking it may be on a different device or
 * browser than the one they registered with.
 */
export function useVerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const verifyEmail = useVerifyEmail();
  const startedForToken = useRef<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const attempt = useCallback(() => {
    setTimedOut(false);
    startedForToken.current = token;
    verifyEmail.mutate(token);
  }, [token, verifyEmail]);

  useEffect(() => {
    if (!token) return;
    if (startedForToken.current === token) return;
    attempt();
  }, [token, attempt]);

  // Safety net: if the request never settles for any reason, stop showing an
  // indefinite spinner and offer a manual retry instead.
  useEffect(() => {
    if (!verifyEmail.isPending) return;
    const timer = window.setTimeout(() => setTimedOut(true), VERIFY_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [verifyEmail.isPending]);

  let status: VerifyEmailStatus;
  if (!token) {
    status = "missing-token";
  } else if (timedOut) {
    status = "timeout";
  } else if (verifyEmail.isSuccess) {
    status = "success";
  } else if (verifyEmail.isError) {
    status = "error";
  } else {
    status = "verifying";
  }

  return {
    status,
    error: verifyEmail.error as Error | null,
    retry: attempt,
  };
}
