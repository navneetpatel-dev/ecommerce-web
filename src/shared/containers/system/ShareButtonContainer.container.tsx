"use client";

import { useShare } from "@/shared/hooks/ui/useShare.hook";
import { ShareButton } from "@/shared/components/system/ShareButton.component";

interface ShareButtonContainerProps {
  url: string;
  title: string;
  label?: string;
}

export function ShareButtonContainer({
  url,
  title,
  label,
}: ShareButtonContainerProps) {
  const share = useShare(url, title);

  return (
    <ShareButton
      copied={share.copied}
      copyFailed={share.copyFailed}
      shareUrl={share.resolvedUrl}
      onLinkFocus={share.handleLinkFocus}
      onShareNative={share.shareNative}
      onCopyLink={share.copyLink}
      label={label}
    />
  );
}
