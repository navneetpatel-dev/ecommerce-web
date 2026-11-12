"use client";

import { useState, type FocusEvent } from "react";
import { SHARE_COPIED_RESET_MS } from "@/shared/constants/timing/timing";
import { writeToClipboard } from "@/shared/utils/dom/clipboard";

function resolveShareUrl(url: string): string {
  if (url.startsWith("http") || typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
}

export function useShare(url: string, title: string) {
  const [copied, setCopied] = useState(false);
  /** B-28: copying failed, so the popover shows the link to copy by hand. */
  const [copyFailed, setCopyFailed] = useState(false);
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
    const ok = await writeToClipboard(resolveShareUrl(url));
    setCopyFailed(!ok);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), SHARE_COPIED_RESET_MS);
  };

  const handleLinkFocus = (event: FocusEvent<HTMLInputElement>) =>
    event.currentTarget.select();

  return {
    copied,
    copyFailed,
    handleLinkFocus,
    resolvedUrl,
    shareNative,
    copyLink,
  };
}
