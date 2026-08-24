"use client";

import { NumberInput } from "@/shared/components/NumberInput.component";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { VendorEntityType } from "@/shared/constants/statuses";
import { CategoriesSection } from "./CategoriesSection.component";
import { UploadsSection } from "./UploadsSection.component";
import { KycChecklistSection } from "./KycChecklistSection.component";

interface VendorShopSettingsFormProps {
  vendorId: string;
  businessName: string;
  returnShippingFee: number | null;
  codEnabled: boolean;
  logoUrl: string | null;
  bannerUrl: string | null;
  entityType: VendorEntityType | null;
  categoryIds: string[];
  checklistKey: number;
  message?: string | null;
  saving: boolean;
  onReturnShippingFeeChange: (value: number | null) => void;
  onCodEnabledChange: (value: boolean) => void;
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
  logoUrl,
  bannerUrl,
  entityType,
  categoryIds,
  checklistKey,
  message,
  saving,
  onReturnShippingFeeChange,
  onCodEnabledChange,
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

        <FormSection
          title={LABELS.settingsFulfillment}
          hint={LABELS.settingsFulfillmentHint}
          columns={3}
        >
          <FormFieldFrame
            label={LABELS.returnShippingFee}
            hint={LABELS.returnShippingFeeHint}
          >
            <NumberInput
              value={returnShippingFee ?? undefined}
              min={0}
              step={10}
              prefix="₹"
              onChange={(value) =>
                onReturnShippingFeeChange(value == null ? null : value)
              }
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.vendorCodEnabled}
            hint={LABELS.vendorCodEnabledHint}
          >
            <CheckboxField
              id="vendor-shop-cod"
              checked={codEnabled}
              onCheckedChange={onCodEnabledChange}
              label={LABELS.vendorCodEnabled}
            />
          </FormFieldFrame>
        </FormSection>

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
