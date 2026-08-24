"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useVerifyEmail } from "../api/auth.queries";

export function useVerifyEmailPage() {
  const searchParams = useSearchParams();
  const verifyEmail = useVerifyEmail();
  const started = useRef(false);
  const token = searchParams.get("token") || "";

  useEffect(() => {
    if (started.current || !token) return;
    started.current = true;
    verifyEmail.mutate(token);
  }, [token, verifyEmail]);

  return {
    token,
    isPending: verifyEmail.isPending,
    isSuccess: verifyEmail.isSuccess,
    error: verifyEmail.error as Error | null,
  };
}
