"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { VendorShopSettingsForm } from "../../components/shop-settings/VendorShopSettingsForm/index";
import { useVendorShopSettingsForm } from "../../hooks/shop-settings/useVendorShopSettingsForm.hook";
import { vendorPagesStyles } from "../overview/vendorPages.styles";

export function VendorShopSettingsPage() {
  const settings = useVendorShopSettingsForm();

  if (settings.loading) {
    return <p className={vendorPagesStyles.loadingText}>{LABELS.loading}</p>;
  }

  if (settings.loadError) {
    return <p className={vendorPagesStyles.errorText}>{settings.loadError}</p>;
  }

  return (
    <RequirePermission
      permission={[
        PERMISSIONS.PRODUCT_UPDATE,
        PERMISSIONS.PRODUCT_CREATE,
        PERMISSIONS.SUBORDER_MANAGE,
        PERMISSIONS.PAYOUT_VIEW,
      ]}
    >
      <VendorShopSettingsForm
        vendorId={settings.vendorId}
        businessName={settings.businessName}
        returnShippingFee={settings.returnShippingFee}
        codEnabled={settings.codEnabled}
        payoutFrequency={settings.payoutFrequency}
        logoUrl={settings.logoUrl}
        bannerUrl={settings.bannerUrl}
        entityType={settings.entityType}
        categoryIds={settings.categoryIds}
        checklistKey={settings.checklistKey}
        message={settings.message}
        saving={settings.saving}
        onReturnShippingFeeChange={settings.setReturnShippingFee}
        onCodEnabledChange={settings.setCodEnabled}
        onPayoutFrequencyChange={settings.setPayoutFrequency}
        onLogoUploaded={settings.setLogoUrl}
        onBannerUploaded={settings.setBannerUrl}
        onEntityTypeChange={settings.setEntityType}
        onCategoryIdsChange={settings.setCategoryIds}
        onSaveCategories={settings.saveCategories}
        onSave={settings.save}
        onClearOverride={settings.clearOverride}
      />
    </RequirePermission>
  );
}
