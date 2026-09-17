"use client";

import { useState } from "react";
import { SHARE_COPIED_RESET_MS } from "@/shared/constants/timing/timing";

function resolveShareUrl(url: string): string {
  if (url.startsWith("http") || typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
}

export function useShare(url: string, title: string) {
  const [copied, setCopied] = useState(false);
  const resolvedUrl = resolveShareUrl(url);

  const shareNative = async () => {
    const shareUrl = resolveShareUrl(url);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return true;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }
    await copyLink();
    return false;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(resolveShareUrl(url));
    setCopied(true);
    window.setTimeout(() => setCopied(false), SHARE_COPIED_RESET_MS);
  };

  return {
    copied,
    resolvedUrl,
    shareNative,
    copyLink,
  };
}
