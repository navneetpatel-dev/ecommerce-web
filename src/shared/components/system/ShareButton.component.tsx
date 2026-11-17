import type { FocusEvent } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { shareButtonStyles } from "@/shared/styles/display/displayComponents.styles";
import { ShareModal } from "./ShareModal.component";
import type { SocialPlatform } from "@/shared/utils/sharing/socialShare";

export interface ShareButtonProps {
  copied: boolean;
  copyFailed?: boolean;
  shareUrl?: string;
  title?: string;
  imageUrl?: string;
  price?: number;
  isGeneratingShortUrl?: boolean;
  onLinkFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onShareNative?: () => void;
  onShareSocial?: (platform: SocialPlatform) => void;
  onCopyLink: (url?: string) => void;
  label?: string;
}

export function ShareButton({
  copied,
  copyFailed = false,
  shareUrl = "",
  title = "Product",
  imageUrl,
  price,
  isGeneratingShortUrl = false,
  onLinkFocus,
  onShareNative,
  onShareSocial = () => {},
  onCopyLink,
  label = LABELS.shareThisProduct,
}: ShareButtonProps) {
  return (
    <>
      <ShareModal
        title={title}
        imageUrl={imageUrl}
        price={price}
        shareUrl={shareUrl}
        copied={copied}
        copyFailed={copyFailed}
        isGeneratingShortUrl={isGeneratingShortUrl}
        onCopyLink={onCopyLink}
        onShareSocial={onShareSocial}
        onShareNative={onShareNative}
        onLinkFocus={onLinkFocus}
        label={label}
        trigger={
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-11 shrink-0 rounded-full border-line px-0 inline-flex items-center justify-center"
            aria-label={LABELS.share}
          >
            <Share2 size={20} />
          </Button>
        }
      />

      <span role="status" className={shareButtonStyles.status}>
        {copied ? LABELS.linkCopied : ""}
      </span>
    </>
  );
}
