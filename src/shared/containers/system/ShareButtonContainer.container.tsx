"use client";

import { useShare } from "@/shared/hooks/ui/useShare.hook";
import { ShareButton } from "@/shared/components/system/ShareButton.component";

export interface ShareButtonContainerProps {
  url: string;
  title: string;
  productId?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  label?: string;
}

export function ShareButtonContainer({
  url,
  title,
  productId,
  imageUrl,
  price,
  description,
  label,
}: ShareButtonContainerProps) {
  const share = useShare(url, title, {
    productId,
    imageUrl,
    price,
    description,
  });

  return (
    <ShareButton
      title={title}
      imageUrl={imageUrl}
      price={price}
      copied={share.copied}
      copyFailed={share.copyFailed}
      shareUrl={share.shortUrl}
      isGeneratingShortUrl={share.isGeneratingShortUrl}
      onLinkFocus={share.handleLinkFocus}
      onShareNative={share.shareNative}
      onShareSocial={share.shareSocial}
      onCopyLink={share.copyLink}
      label={label}
    />
  );
}
