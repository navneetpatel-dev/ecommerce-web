"use client";

import { Share2, Mail } from "lucide-react";
import {
  WhatsAppIcon,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  PinterestIcon,
  LinkedInIcon,
} from "./SocialIcons";
import type { SocialPlatform } from "@/shared/utils/sharing/socialShare";

interface SocialShareGridProps {
  onShareSocial: (platform: SocialPlatform) => void;
  onShareNative?: () => void;
  hasNativeShare?: boolean;
}

export function SocialShareGrid({
  onShareSocial,
  onShareNative,
  hasNativeShare,
}: SocialShareGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-4">
      <button
        type="button"
        onClick={() => onShareSocial("whatsapp")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20"
        aria-label="Share on WhatsApp"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
          <WhatsAppIcon className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-medium text-ink">WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={() => onShareSocial("facebook")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20"
        aria-label="Share on Facebook"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm">
          <FacebookIcon className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-medium text-ink">Facebook</span>
      </button>

      <button
        type="button"
        onClick={() => onShareSocial("twitter")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-surface-raised hover:border-ink/30"
        aria-label="Share on X"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-sm dark:bg-paper dark:text-ink">
          <TwitterIcon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-medium text-ink">X</span>
      </button>

      <button
        type="button"
        onClick={() => onShareSocial("telegram")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-sky-50 hover:border-sky-300 dark:hover:bg-sky-950/20"
        aria-label="Share on Telegram"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#24A1DE] text-white shadow-sm">
          <TelegramIcon className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-medium text-ink">Telegram</span>
      </button>

      <button
        type="button"
        onClick={() => onShareSocial("pinterest")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20"
        aria-label="Share on Pinterest"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E60023] text-white shadow-sm">
          <PinterestIcon className="h-5 w-5" />
        </div>
        <span className="text-[11px] font-medium text-ink">Pinterest</span>
      </button>

      <button
        type="button"
        onClick={() => onShareSocial("linkedin")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950/20"
        aria-label="Share on LinkedIn"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-sm">
          <LinkedInIcon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-medium text-ink">LinkedIn</span>
      </button>

      <button
        type="button"
        onClick={() => onShareSocial("email")}
        className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-surface-raised"
        aria-label="Share via Email"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-ink border border-line shadow-sm">
          <Mail className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-medium text-ink">Email</span>
      </button>

      {hasNativeShare && onShareNative ? (
        <button
          type="button"
          onClick={onShareNative}
          className="flex flex-col items-center gap-1.5 rounded-lg border border-line p-2.5 text-center transition-colors hover:bg-surface-raised"
          aria-label="More sharing options"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-ink border border-line shadow-sm">
            <Share2 className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-medium text-ink">More</span>
        </button>
      ) : null}
    </div>
  );
}
