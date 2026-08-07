'use client'

import type { ReactNode } from 'react'
import { NumberInput } from '@/shared/components/NumberInput'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { LABELS } from '@/shared/constants/labels'

interface VendorShopSettingsFormProps {
  businessName: string
  returnShippingFee: number | null
  message?: string | null
  saving: boolean
  onReturnShippingFeeChange: (value: number | null) => void
  onSave: () => void
  onClearOverride: () => void
}

function SettingsSection({
  title,
  hint,
  children,
}: {
  title: string
  hint: string
  children: ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-md border border-line bg-surface shadow-[0_1px_0_rgba(15,23,42,0.03)]">
      <header className="border-b border-line/80 bg-paper/50 px-4 py-4 sm:px-5">
        <h3 className="text-[0.9375rem] font-semibold tracking-tight text-ink">{title}</h3>
        <p className="mt-1 text-[0.8125rem] text-ink-muted">{hint}</p>
      </header>
      <div className="grid gap-5 p-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 sm:p-5">{children}</div>
    </section>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className ?? 'space-y-2'}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export function VendorShopSettingsForm({
  businessName,
  returnShippingFee,
  message,
  saving,
  onReturnShippingFeeChange,
  onSave,
  onClearOverride,
}: VendorShopSettingsFormProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.vendorShopSettings}
        </h2>
        <p className="max-w-2xl text-[0.9375rem] text-ink-muted">{LABELS.vendorShopSettingsHint}</p>
        {businessName ? (
          <p className="text-[0.8125rem] text-ink-faint">{businessName}</p>
        ) : null}
      </div>

      <SettingsSection title={LABELS.settingsFulfillment} hint={LABELS.settingsFulfillmentHint}>
        <Field label={LABELS.returnShippingFee} className="space-y-2 sm:col-span-2 sm:max-w-md">
          <NumberInput
            value={returnShippingFee ?? undefined}
            min={0}
            step={10}
            prefix="₹"
            onChange={(value) => onReturnShippingFeeChange(value == null ? null : value)}
          />
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.returnShippingFeeHint}</p>
        </Field>
      </SettingsSection>

      <div className="flex flex-col gap-3 border-t border-line/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-[1.25rem] text-[0.8125rem] text-ink-muted" aria-live="polite">
          {message}
        </p>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button type="button" variant="outline" disabled={saving} onClick={onClearOverride}>
            {LABELS.vendorReturnShippingFeeClear}
          </Button>
          <Button type="button" disabled={saving} onClick={onSave}>
            {LABELS.saveSettings}
          </Button>
        </div>
      </div>
    </div>
  )
}
