'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { LABELS } from '@/shared/constants/labels'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { VendorShopSettingsForm } from '../components/VendorShopSettingsForm'
import { useVendorShopSettingsForm } from '../hooks/useVendorShopSettingsForm'

export function VendorShopSettingsPage() {
  const settings = useVendorShopSettingsForm()

  if (settings.loading) {
    return <p className="text-ink-muted">{LABELS.loading}</p>
  }

  if (settings.loadError) {
    return <p className="text-danger">{settings.loadError}</p>
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
        businessName={settings.businessName}
        returnShippingFee={settings.returnShippingFee}
        message={settings.message}
        saving={settings.saving}
        onReturnShippingFeeChange={settings.setReturnShippingFee}
        onSave={settings.save}
        onClearOverride={settings.clearOverride}
      />
    </RequirePermission>
  )
}
