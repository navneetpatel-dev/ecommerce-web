"use client";

import { FormActions, FormStack } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { VendorEntityType } from "@/shared/constants/statuses";
import type { VendorPayoutFrequency } from "../../api/vendor.api";
import { CategoriesSection } from "./CategoriesSection.component";
import { UploadsSection } from "./UploadsSection.component";
import { KycChecklistSection } from "./KycChecklistSection.component";
import { FulfillmentSection } from "./FulfillmentSection.component";

interface VendorShopSettingsFormProps {
  vendorId: string;
  businessName: string;
  returnShippingFee: number | null;
  codEnabled: boolean;
  payoutFrequency: VendorPayoutFrequency | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  entityType: VendorEntityType | null;
  categoryIds: string[];
  checklistKey: number;
  message?: string | null;
  saving: boolean;
  onReturnShippingFeeChange: (value: number | null) => void;
  onCodEnabledChange: (value: boolean) => void;
  onPayoutFrequencyChange: (value: VendorPayoutFrequency | null) => void;
  onLogoUploaded: (url: string) => void;
  onBannerUploaded: (url: string) => void;
  onEntityTypeChange: (value: VendorEntityType) => void;
  onCategoryIdsChange: (ids: string[]) => void;
  onSaveCategories: () => void;
  onSave: () => void;
  onClearOverride: () => void;
}

export function VendorShopSettingsForm({
  vendorId,
  businessName,
  returnShippingFee,
  codEnabled,
  payoutFrequency,
  logoUrl,
  bannerUrl,
  entityType,
  categoryIds,
  checklistKey,
  message,
  saving,
  onReturnShippingFeeChange,
  onCodEnabledChange,
  onPayoutFrequencyChange,
  onLogoUploaded,
  onBannerUploaded,
  onEntityTypeChange,
  onCategoryIdsChange,
  onSaveCategories,
  onSave,
  onClearOverride,
}: VendorShopSettingsFormProps) {
  return (
    <div className="w-full min-w-0">
      <FormStack className="space-y-8">
        <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-1.5">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.vendorShopSettings}
            </h2>
            <p className="max-w-3xl text-body leading-relaxed text-ink-muted">
              {LABELS.vendorShopSettingsHint}
            </p>
            {businessName ? (
              <p className="text-body-sm text-ink-faint">{businessName}</p>
            ) : null}
          </div>
          <Button
            type="button"
            className="hidden shrink-0 sm:inline-flex"
            disabled={saving}
            onClick={onSave}
          >
            {LABELS.saveSettings}
          </Button>
        </div>

        <CategoriesSection
          entityType={entityType}
          categoryIds={categoryIds}
          saving={saving}
          onEntityTypeChange={onEntityTypeChange}
          onCategoryIdsChange={onCategoryIdsChange}
          onSaveCategories={onSaveCategories}
        />

        <UploadsSection
          vendorId={vendorId}
          saving={saving}
          logoUrl={logoUrl}
          bannerUrl={bannerUrl}
          onLogoUploaded={onLogoUploaded}
          onBannerUploaded={onBannerUploaded}
        />

        <KycChecklistSection
          vendorId={vendorId}
          saving={saving}
          checklistKey={checklistKey}
        />

        <FulfillmentSection
          returnShippingFee={returnShippingFee}
          codEnabled={codEnabled}
          payoutFrequency={payoutFrequency}
          onReturnShippingFeeChange={onReturnShippingFeeChange}
          onCodEnabledChange={onCodEnabledChange}
          onPayoutFrequencyChange={onPayoutFrequencyChange}
        />

        <FormActions leading={message}>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={onClearOverride}
          >
            {LABELS.vendorReturnShippingFeeClear}
          </Button>
          <Button
            type="button"
            fullWidth="mobile"
            disabled={saving}
            onClick={onSave}
          >
            {LABELS.saveSettings}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  );
}
