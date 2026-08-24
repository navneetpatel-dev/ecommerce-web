"use client";

import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";

interface UploadsSectionProps {
  vendorId: string;
  saving: boolean;
  logoUrl: string | null;
  bannerUrl: string | null;
  onLogoUploaded: (url: string) => void;
  onBannerUploaded: (url: string) => void;
}

export function UploadsSection({
  vendorId,
  saving,
  logoUrl,
  bannerUrl,
  onLogoUploaded,
  onBannerUploaded,
}: UploadsSectionProps) {
  return (
    <FormSection
      title={LABELS.vendorLogoUpload}
      hint={LABELS.uploadProfilePhotoHint}
    >
      <div className="sm:col-span-2">
        <FileUpload
          entityType={UPLOAD_ENTITY.VENDORS}
          entityId={vendorId}
          purpose={UPLOAD_PURPOSE.LOGO}
          accept="image/png,image/jpeg,image/webp"
          valueUrl={logoUrl}
          onUploaded={onLogoUploaded}
          disabled={!vendorId || saving}
          label={LABELS.vendorLogoUpload}
        />
      </div>
      <div className="sm:col-span-2">
        <FileUpload
          entityType={UPLOAD_ENTITY.VENDORS}
          entityId={vendorId}
          purpose={UPLOAD_PURPOSE.BANNER}
          accept="image/png,image/jpeg,image/webp"
          valueUrl={bannerUrl}
          onUploaded={onBannerUploaded}
          disabled={!vendorId || saving}
          label={LABELS.vendorBannerUpload}
        />
      </div>
    </FormSection>
  );
}
