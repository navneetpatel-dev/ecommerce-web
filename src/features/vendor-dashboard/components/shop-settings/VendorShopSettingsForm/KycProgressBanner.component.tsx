import { ShieldCheck } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { vendorShopSettingsFormStyles } from "./vendorShopSettingsForm.styles";

interface KycProgressBannerProps {
  isComplete: boolean;
  verifiedCount: number;
  totalCount: number;
  progressPercent: number;
}

export function KycProgressBanner({
  isComplete,
  verifiedCount,
  totalCount,
  progressPercent,
}: KycProgressBannerProps) {
  return (
    <div className={vendorShopSettingsFormStyles.bannerRoot}>
      <div className={vendorShopSettingsFormStyles.bannerRow}>
        <div className={vendorShopSettingsFormStyles.bannerLeft}>
          <div
            className={cn(
              vendorShopSettingsFormStyles.bannerIconCircle,
              isComplete
                ? vendorShopSettingsFormStyles.bannerIconComplete
                : vendorShopSettingsFormStyles.bannerIconPending,
            )}
          >
            <ShieldCheck
              className={vendorShopSettingsFormStyles.bannerIcon}
              aria-hidden
            />
          </div>
          <div>
            <p className={vendorShopSettingsFormStyles.bannerHeading}>
              {isComplete
                ? LABELS.kycAllDocumentsVerified
                : LABELS.kycVerificationProgress}
            </p>
            <p className={vendorShopSettingsFormStyles.bannerSubtitle}>
              {isComplete
                ? LABELS.kycChecklistComplete
                : LABELS.kycChecklistIncomplete}
            </p>
          </div>
        </div>
        <div className={vendorShopSettingsFormStyles.bannerRight}>
          <span className={vendorShopSettingsFormStyles.bannerPercent}>
            {LABELS.kycDocumentsVerifiedCount
              .replace("{verified}", String(verifiedCount))
              .replace("{total}", String(totalCount))}
          </span>
          <span className={vendorShopSettingsFormStyles.bannerFraction}>
            ({progressPercent}%)
          </span>
        </div>
      </div>

      {totalCount > 0 && !isComplete ? (
        <div className={vendorShopSettingsFormStyles.progressBar}>
          <div
            className={vendorShopSettingsFormStyles.progressIndicator}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
