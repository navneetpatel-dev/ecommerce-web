"use client";

import { useState, useEffect, useCallback, type FocusEvent } from "react";
import { SHARE_COPIED_RESET_MS } from "@/shared/constants/timing/timing";
import { writeToClipboard } from "@/shared/utils/dom/clipboard";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import {
  openSocialShare,
  type SocialPlatform,
} from "@/shared/utils/sharing/socialShare";

export interface ShareOptions {
  productId?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
}

function resolveShareUrl(url: string): string {
  if (url.startsWith("http") || typeof window === "undefined") return url;
  return new URL(url, window.location.origin).toString();
}

export function useShare(url: string, title: string, options?: ShareOptions) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [shortUrl, setShortUrl] = useState<string>("");
  const [isGeneratingShortUrl, setIsGeneratingShortUrl] = useState(false);

  const resolvedUrl = resolveShareUrl(url);
  const effectiveUrl = shortUrl || resolvedUrl;

  useEffect(() => {
    let active = true;

    async function generateShortLink() {
      setIsGeneratingShortUrl(true);
      try {
        const res = await fetch("/api/short-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetUrl: url,
            resourceType: "PRODUCT",
            resourceId: options?.productId,
            metadata: {
              name: title,
              imageUrl: options?.imageUrl,
              price: options?.price,
              description: options?.description,
            },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (active && json.success && json.data?.shortUrl) {
            setShortUrl(json.data.shortUrl);
          }
        }
      } catch {
        // Fallback gracefully to resolvedUrl
      } finally {
        if (active) setIsGeneratingShortUrl(false);
      }
    }

    if (url) {
      generateShortLink();
    }

    return () => {
      active = false;
    };
  }, [
    url,
    title,
    options?.productId,
    options?.imageUrl,
    options?.price,
    options?.description,
  ]);

  const copyLink = useCallback(
    async (urlToCopy?: string) => {
      const target = urlToCopy || effectiveUrl;
      const ok = await writeToClipboard(target);
      setCopyFailed(!ok);
      if (!ok) return;

      setCopied(true);
      notifySuccess("Link copied to clipboard!");
      window.setTimeout(() => setCopied(false), SHARE_COPIED_RESET_MS);
    },
    [effectiveUrl],
  );

  const shareNative = useCallback(async () => {
    const target = effectiveUrl;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: target });
        return true;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }
    await copyLink();
    return false;
  }, [effectiveUrl, title, copyLink]);

  const shareSocial = useCallback(
    (platform: SocialPlatform) => {
      openSocialShare(platform, {
        url: effectiveUrl,
        title,
        imageUrl: options?.imageUrl,
        description: options?.description,
      });
    },
    [effectiveUrl, title, options?.imageUrl, options?.description],
  );

  const handleLinkFocus = (event: FocusEvent<HTMLInputElement>) =>
    event.currentTarget.select();

  return {
    copied,
    copyFailed,
    handleLinkFocus,
    resolvedUrl,
    shortUrl: effectiveUrl,
    isGeneratingShortUrl,
    shareNative,
    copyLink,
    shareSocial,
  };
}
