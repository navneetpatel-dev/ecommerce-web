import type { FocusEvent } from "react";
import { Share2, Link as LinkIcon } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { shareButtonStyles } from "@/shared/styles/display/displayComponents.styles";

interface ShareButtonProps {
  copied: boolean;
  /** Copying failed: show the link to copy by hand (B-28). */
  copyFailed?: boolean;
  shareUrl?: string;
  onLinkFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onShareNative: () => void;
  onCopyLink: () => void;
  label?: string;
}

export function ShareButton({
  copied,
  copyFailed = false,
  shareUrl = "",
  onLinkFocus,
  onShareNative,
  onCopyLink,
  label = LABELS.shareThisProduct,
}: ShareButtonProps) {
  const mobileShareLabel = copied ? LABELS.linkCopied : LABELS.share;
  const copyLinkLabel = copied ? LABELS.linkCopied : LABELS.copyLink;

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className={shareButtonStyles.mobileBtn}
        onClick={onShareNative}
        aria-label={mobileShareLabel}
      >
        <Share2 size={18} />
      </Button>

      {/* Announces the copy for screen readers and anyone who missed the label change. */}
      <span role="status" className={shareButtonStyles.status}>
        {copied ? LABELS.linkCopied : ""}
      </span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={shareButtonStyles.desktopBtn}
            aria-label={LABELS.share}
          >
            <Share2 size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={shareButtonStyles.popoverContent}>
          <div className={shareButtonStyles.popoverBody}>
            <h3 className={shareButtonStyles.popoverTitle}>{label}</h3>
            <Button
              type="button"
              variant="outline"
              onClick={onCopyLink}
              className={shareButtonStyles.copyLinkBtn}
            >
              <LinkIcon className={shareButtonStyles.linkIcon} />
              {copyLinkLabel}
            </Button>
            {copyFailed ? (
              <div className={shareButtonStyles.manualCopy}>
                <p className={shareButtonStyles.manualCopyHint}>
                  {LABELS.copyLinkManually}
                </p>
                <Input
                  readOnly
                  value={shareUrl}
                  aria-label={LABELS.productLink}
                  onFocus={onLinkFocus}
                />
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
