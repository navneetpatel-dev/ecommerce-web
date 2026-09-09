import { Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { shareButtonStyles } from "./displayComponents.styles";

interface ShareButtonProps {
  copied: boolean;
  onShareNative: () => void;
  onCopyLink: () => void;
  label?: string;
}

export function ShareButton({
  copied,
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
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
