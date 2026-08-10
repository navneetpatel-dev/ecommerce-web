'use client'

import { NumberInput } from '@/shared/components/NumberInput'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
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
  onReturnShippingFeeChange: (value: number) => void
  onSupportEmailChange: (value: string) => void
  onSupportHoursChange: (value: string) => void
  onSave: () => void
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
  onReturnShippingFeeChange,
  onSupportEmailChange,
  onSupportHoursChange,
  onSave,
}: PlatformSettingsFormProps) {
  return (
    <div className="w-full min-w-0">
      <FormStack className="space-y-8">
        <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-1.5">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.platformSettings}
            </h2>
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
              {LABELS.platformSettingsHint}
            </p>
          </div>
          <Button
            type="button"
            className="hidden shrink-0 sm:inline-flex"
            onClick={onSave}
          >
            {LABELS.saveSettings}
          </Button>
        </div>

        <FormSection title={LABELS.settingsCommerce} hint={LABELS.settingsCommerceHint} columns={3}>
          <FormFieldFrame label={LABELS.defaultCommissionRate}>
            <NumberInput
              value={form.defaultCommissionRate}
              min={0}
              max={100}
              step={0.5}
              suffix="%"
              onChange={(value) => onCommissionRateChange(value ?? 0)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.tcsRatePercent} hint={LABELS.tcsRateHint}>
            <NumberInput
              value={form.tcsRatePercent}
              min={0}
              max={100}
              step={0.1}
              suffix="%"
              onChange={(value) => onTcsRateChange(value ?? 0)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.tdsRatePercent} hint={LABELS.tdsRateHint}>
            <NumberInput
              value={form.tdsRatePercent}
              min={0}
              max={100}
              step={0.1}
              suffix="%"
              onChange={(value) => onTdsRateChange(value ?? 0)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.autoApproveProducts}>
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
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.settingsFulfillment}
          hint={LABELS.settingsFulfillmentHint}
          columns={3}
        >
          <FormFieldFrame label={LABELS.defaultReturnWindow}>
            <NumberInput
              value={form.defaultReturnWindow}
              min={0}
              max={365}
              step={1}
              suffix={LABELS.daysShort}
              onChange={(value) => onReturnWindowChange(value ?? 0)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.freeShippingThreshold}>
            <NumberInput
              value={form.freeShippingThreshold}
              min={0}
              step={50}
              prefix="₹"
              onChange={(value) => onFreeShippingThresholdChange(value ?? 0)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.returnShippingFee} hint={LABELS.returnShippingFeeHint}>
            <NumberInput
              value={form.returnShippingFee ?? 0}
              min={0}
              step={10}
              prefix="₹"
              onChange={(value) => onReturnShippingFeeChange(value ?? 0)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.payoutCycle}>
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
          </FormFieldFrame>
        </FormSection>

        <FormSection title={LABELS.settingsSupport} hint={LABELS.settingsSupportHint} columns={2}>
          <FormFieldFrame label={LABELS.supportEmail} htmlFor="platform-support-email">
            <Input
              id="platform-support-email"
              type="email"
              value={form.supportEmail}
              onChange={(e) => onSupportEmailChange(e.target.value)}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.supportHours} htmlFor="platform-support-hours">
            <Input
              id="platform-support-hours"
              value={form.supportHours}
              onChange={(e) => onSupportHoursChange(e.target.value)}
            />
          </FormFieldFrame>
        </FormSection>

        <FormActions leading={message}>
          <Button type="button" fullWidth="mobile" onClick={onSave}>
            {LABELS.saveSettings}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  )
}
