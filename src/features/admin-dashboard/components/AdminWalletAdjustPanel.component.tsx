"use client";

import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { useAdminWalletAdjust } from "../hooks/useAdminWalletAdjust.hook";

export function AdminWalletAdjustPanel() {
  const form = useAdminWalletAdjust();

  return (
    <RequirePermission permission={PERMISSIONS.WALLET_ADJUST}>
      <div className="space-y-4 rounded-md border border-line bg-surface p-4">
        <h3 className="text-body font-semibold text-ink">{LABELS.walletAdjustTitle}</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldFrame label={LABELS.walletAdjustUserId} htmlFor="wallet-adjust-user">
            <Input
              id="wallet-adjust-user"
              value={form.userId}
              onChange={(e) => form.setUserId(e.target.value)}
            />
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.walletAdjustDirection} htmlFor="wallet-adjust-direction">
            <Select
              value={form.direction}
              onValueChange={(value) => form.setDirection(value as "CREDIT" | "DEBIT")}
            >
              <SelectTrigger id="wallet-adjust-direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREDIT">{LABELS.walletCredit}</SelectItem>
                <SelectItem value="DEBIT">{LABELS.walletDebit}</SelectItem>
              </SelectContent>
            </Select>
          </FormFieldFrame>

          <FormFieldFrame label={LABELS.walletAdjustAmount} htmlFor="wallet-adjust-amount">
            <NumberInput
              id="wallet-adjust-amount"
              value={form.amount}
              min={1}
              step={1}
              showSteppers={false}
              onChange={form.setAmount}
            />
          </FormFieldFrame>

          {form.direction === "CREDIT" ? (
            <FormFieldFrame
              label={LABELS.walletAdjustPointSource}
              htmlFor="wallet-adjust-source"
            >
              <Select
                value={form.pointSource}
                onValueChange={(value) =>
                  form.setPointSource(value as "PURCHASED" | "PROMOTIONAL")
                }
              >
                <SelectTrigger id="wallet-adjust-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PURCHASED">
                    {LABELS.reportPurchasedPoints}
                  </SelectItem>
                  <SelectItem value="PROMOTIONAL">
                    {LABELS.reportPromotionalPoints}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormFieldFrame>
          ) : null}
        </div>

        <FormFieldFrame label={LABELS.walletAdjustReason} htmlFor="wallet-adjust-reason">
          <Textarea
            id="wallet-adjust-reason"
            value={form.reason}
            rows={3}
            onChange={(e) => form.setReason(e.target.value)}
          />
        </FormFieldFrame>

        <Button type="button" disabled={form.loading} onClick={() => void form.submit()}>
          {form.loading ? LABELS.loading : LABELS.walletAdjustSubmit}
        </Button>

        {form.error ? <p className="text-body-sm text-danger">{form.error}</p> : null}
        {form.message ? <p className="text-body-sm text-success">{form.message}</p> : null}
      </div>
    </RequirePermission>
  );
}
