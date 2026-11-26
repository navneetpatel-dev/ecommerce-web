"use client";

import { useState, useId, type ReactNode, type FocusEvent } from "react";
import Image from "next/image";
import { Copy, Check, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { SocialShareGrid } from "./SocialShareGrid.component";
import type { SocialPlatform } from "@/shared/utils/sharing/socialShare";

export interface ShareModalProps {
  trigger?: ReactNode;
  title: string;
  shareUrl: string;
  imageUrl?: string;
  price?: number;
  copied: boolean;
  copyFailed?: boolean;
  isGeneratingShortUrl?: boolean;
  onCopyLink: (url?: string) => void;
  onShareSocial: (platform: SocialPlatform) => void;
  onShareNative?: () => void;
  onLinkFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  label?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareModal({
  trigger,
  title,
  shareUrl,
  imageUrl,
  price,
  copied,
  copyFailed = false,
  isGeneratingShortUrl = false,
  onCopyLink,
  onShareSocial,
  onShareNative,
  onLinkFocus,
  label = "Share this product",
  open,
  onOpenChange,
}: ShareModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;
  const hasNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";
  const inputId = useId();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-body-lg font-semibold text-ink">
            {label}
          </DialogTitle>
          <DialogDescription className="text-body-sm text-ink-muted">
            Share this link with friends or across social media.
          </DialogDescription>
        </DialogHeader>

        {/* Product Snippet Preview */}
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-surface-raised p-3">
          {imageUrl && !imgError ? (
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
              <Image
                src={imageUrl}
                alt={title}
                width={56}
                height={56}
                unoptimized
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-ink-muted">
              <ShoppingBag size={24} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-body-sm font-medium text-ink">
              {title}
            </h4>
            {price != null ? (
              <p className="mt-0.5 text-body-sm font-semibold text-brand">
                {formatInr(price)}
              </p>
            ) : null}
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="mt-4 space-y-1.5">
          <label
            htmlFor={inputId}
            className="text-caption font-medium text-ink-muted"
          >
            Short Link
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                id={inputId}
                readOnly
                value={shareUrl || "Generating short link..."}
                onFocus={onLinkFocus}
                className="h-10 pr-8 text-body-sm font-mono"
              />
              {isGeneratingShortUrl ? (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                </div>
              ) : null}
            </div>
            <Button
              type="button"
              variant={copied ? "default" : "outline"}
              onClick={() => onCopyLink()}
              className="h-10 shrink-0 gap-1.5 px-4 transition-all"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          {copyFailed ? (
            <p className="text-caption text-error">
              Copying was blocked by your browser. Please select and copy the
              link manually.
            </p>
          ) : null}
        </div>

        {/* Social Media Share Channels */}
        <div className="mt-4">
          <p className="mb-2 text-caption font-medium text-ink-muted">
            Share via
          </p>
          <SocialShareGrid
            onShareSocial={onShareSocial}
            onShareNative={onShareNative}
            hasNativeShare={hasNativeShare}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
