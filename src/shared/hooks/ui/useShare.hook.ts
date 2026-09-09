"use client";

import { useEffect, useState } from "react";
import { SHARE_COPIED_RESET_MS } from "@/shared/constants/timing/timing";

export function useShare(url: string, title: string) {
  const [copied, setCopied] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState(url);

  useEffect(() => {
    if (url.startsWith("http")) {
      setResolvedUrl(url);
      return;
    }
    if (typeof window !== "undefined") {
      setResolvedUrl(new URL(url, window.location.origin).toString());
    }
  }, [url]);

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: resolvedUrl });
        return true;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }
    await copyLink();
    return false;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(resolvedUrl);
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
