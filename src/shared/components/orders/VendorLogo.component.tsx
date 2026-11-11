"use client";

import Image from "next/image";
import { useImageFallback } from "@/shared/hooks/media/useImageFallback.hook";
import { vendorStripStyles } from "../../styles/orders/vendorOrderComponents.styles";

interface VendorLogoProps {
  logoUrl?: string | null;
  businessName: string;
}

/**
 * A shop's logo in a fixed 20px circle. If the image is missing or fails to
 * load, the shop's initial shows instead; a broken image never takes its own
 * size (it used to balloon to 174px with the alt text spilling out).
 */
export function VendorLogo({ logoUrl, businessName }: VendorLogoProps) {
  const { showImage, handleError } = useImageFallback(logoUrl);

  return (
    <span className={vendorStripStyles.logoFrame} aria-hidden>
      {showImage && logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          width={20}
          height={20}
          onError={handleError}
          className={vendorStripStyles.logo}
        />
      ) : (
        <span className={vendorStripStyles.avatar}>
          {businessName.charAt(0)}
        </span>
      )}
    </span>
  );
}
