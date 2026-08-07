'use client'

import { NumberInput } from '@/shared/components/NumberInput'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { VENDOR_NAV } from '@/shared/constants/vendorNav'
import { useVendorShopSettingsForm } from '../hooks/useVendorShopSettingsForm'

export function VendorShopSettingsPage() {
  const form = useVendorShopSettingsForm()

  if (form.loading) {
    return <p className="text-ink-muted">{LABELS.loading}</p>
  }

  if (form.loadError) {
    return <p className="text-danger">{form.loadError}</p>
  }

  return (
    <RequirePermission
      permission={VENDOR_NAV.find((n) => n.href === PATHS.vendor.shopSettings)!.permissions}
    >
      <div className="mx-auto w-full max-w-xl space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.vendorShopSettings}
          </h2>
          <p className="text-[0.9375rem] text-ink-muted">{LABELS.vendorShopSettingsHint}</p>
          {form.businessName ? (
            <p className="text-[0.8125rem] text-ink-faint">{form.businessName}</p>
          ) : null}
        </div>

        <section className="space-y-4 border border-line bg-surface-raised p-5">
          <div className="space-y-2">
            <Label>{LABELS.returnShippingFee}</Label>
            <NumberInput
              value={form.returnShippingFee ?? undefined}
              min={0}
              step={10}
              prefix="₹"
              onChange={(value) => form.setReturnShippingFee(value == null ? null : value)}
            />
            <p className="text-[0.8125rem] text-ink-muted">{LABELS.returnShippingFeeHint}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={form.save} disabled={form.saving}>
              {LABELS.save}
            </Button>
            <Button type="button" variant="outline" onClick={form.clearOverride} disabled={form.saving}>
              {LABELS.vendorReturnShippingFeeClear}
            </Button>
          </div>

          {form.message ? (
            <p className="text-[0.875rem] text-ink-muted">{form.message}</p>
          ) : null}
        </section>
      </div>
    </RequirePermission>
  )
}
