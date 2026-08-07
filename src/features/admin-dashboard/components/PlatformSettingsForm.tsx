'use client'

import { NumberInput } from '@/shared/components/NumberInput'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import type { PlatformSettings } from '../hooks/usePlatformSettingsForm'
import type { ReactNode } from 'react'

interface PlatformSettingsFormProps {
  form: PlatformSettings
  message?: string | null
  onCommissionRateChange: (value: number) => void
  onTcsRateChange: (value: number) => void
  onTdsRateChange: (value: number) => void
  onAutoApproveChange: (value: boolean) => void
  onReturnWindowChange: (value: number) => void
  onPayoutCycleChange: (value: string) => void
  onFreeShippingThresholdChange: (value: number) => void
  onSupportEmailChange: (value: string) => void
  onSupportHoursChange: (value: string) => void
  onSave: () => void
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
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className ?? 'space-y-2'}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

export function PlatformSettingsForm({
  form,
  message,
  onCommissionRateChange,
  onTcsRateChange,
  onTdsRateChange,
  onAutoApproveChange,
  onReturnWindowChange,
  onPayoutCycleChange,
  onFreeShippingThresholdChange,
  onSupportEmailChange,
  onSupportHoursChange,
  onSave,
}: PlatformSettingsFormProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-1">
        <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {LABELS.platformSettings}
        </h2>
        <p className="max-w-2xl text-[0.9375rem] text-ink-muted">{LABELS.platformSettingsHint}</p>
      </div>

      <SettingsSection title={LABELS.settingsCommerce} hint={LABELS.settingsCommerceHint}>
        <Field label={LABELS.defaultCommissionRate}>
          <NumberInput
            value={form.defaultCommissionRate}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
            onChange={(value) => onCommissionRateChange(value ?? 0)}
          />
        </Field>
        <Field label={LABELS.tcsRatePercent}>
          <NumberInput
            value={form.tcsRatePercent}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            onChange={(value) => onTcsRateChange(value ?? 0)}
          />
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.tcsRateHint}</p>
        </Field>
        <Field label={LABELS.tdsRatePercent}>
          <NumberInput
            value={form.tdsRatePercent}
            min={0}
            max={100}
            step={0.1}
            suffix="%"
            onChange={(value) => onTdsRateChange(value ?? 0)}
          />
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.tdsRateHint}</p>
        </Field>
        <Field label={LABELS.autoApproveProducts}>
          <Select
            value={form.autoApproveProducts ? 'true' : 'false'}
            onValueChange={(value) => onAutoApproveChange(value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{LABELS.autoApproveEnabled}</SelectItem>
              <SelectItem value="false">{LABELS.autoApproveDisabled}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SettingsSection>

      <SettingsSection title={LABELS.settingsFulfillment} hint={LABELS.settingsFulfillmentHint}>
        <Field label={LABELS.defaultReturnWindow}>
          <NumberInput
            value={form.defaultReturnWindow}
            min={0}
            max={365}
            step={1}
            suffix={LABELS.daysShort}
            onChange={(value) => onReturnWindowChange(value ?? 0)}
          />
        </Field>
        <Field label={LABELS.freeShippingThreshold}>
          <NumberInput
            value={form.freeShippingThreshold}
            min={0}
            step={50}
            prefix="₹"
            onChange={(value) => onFreeShippingThresholdChange(value ?? 0)}
          />
        </Field>
        <Field label={LABELS.payoutCycle} className="space-y-2 sm:col-span-2 sm:max-w-md">
          <Select value={form.payoutCycle} onValueChange={onPayoutCycleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEKLY">{LABELS.payoutCycleWeekly}</SelectItem>
              <SelectItem value="BIWEEKLY">{LABELS.payoutCycleBiweekly}</SelectItem>
              <SelectItem value="MONTHLY">{LABELS.payoutCycleMonthly}</SelectItem>
              <SelectItem value="weekly">{LABELS.payoutCycleWeeklyLegacy}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </SettingsSection>

      <SettingsSection title={LABELS.settingsSupport} hint={LABELS.settingsSupportHint}>
        <Field label={LABELS.supportEmail} htmlFor="platform-support-email">
          <Input
            id="platform-support-email"
            type="email"
            value={form.supportEmail}
            onChange={(e) => onSupportEmailChange(e.target.value)}
          />
        </Field>
        <Field label={LABELS.supportHours} htmlFor="platform-support-hours">
          <Input
            id="platform-support-hours"
            value={form.supportHours}
            onChange={(e) => onSupportHoursChange(e.target.value)}
          />
        </Field>
      </SettingsSection>

      <div className="flex flex-col gap-3 border-t border-line/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-h-[1.25rem] text-[0.8125rem] text-ink-muted" aria-live="polite">
          {message}
        </p>
        <Button type="button" className="w-full sm:w-auto" onClick={onSave}>
          {LABELS.saveSettings}
        </Button>
      </div>
    </div>
  )
}
