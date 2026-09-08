"use client";

import { SlidersHorizontal, AlertCircle, CheckCircle2 } from "lucide-react";
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
      <div className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand shadow-elevation-1">
              <SlidersHorizontal className="size-5" />
            </div>
            <div>
              <h2 className="font-display text-[1.125rem] font-semibold text-ink">
                {LABELS.walletAdjustTitle}
              </h2>
              <p className="text-body-sm text-ink-muted">
                Manually credit or debit customer wallet points with audit
                logging and reason tracking
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="space-y-5 rounded-lg border border-line bg-paper/40 p-4 md:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormFieldFrame
              label={LABELS.walletAdjustUserId}
              htmlFor="wallet-adjust-user"
              error={form.fieldError("userId")}
            >
              <Input
                id="wallet-adjust-user"
                value={form.userId}
                placeholder="e.g. usr_123456789"
                onChange={(e) => form.setUserId(e.target.value)}
                error={Boolean(form.fieldError("userId"))}
              />
            </FormFieldFrame>

            <FormFieldFrame
              label={LABELS.walletAdjustDirection}
              htmlFor="wallet-adjust-direction"
            >
              <Select
                value={form.direction}
                onValueChange={(value) =>
                  form.setDirection(value as "CREDIT" | "DEBIT")
                }
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

            <FormFieldFrame
              label={LABELS.walletAdjustAmount}
              htmlFor="wallet-adjust-amount"
              error={form.fieldError("amount")}
            >
              <NumberInput
                id="wallet-adjust-amount"
                value={form.amount}
                min={1}
                step={1}
                showSteppers={false}
                onChange={form.setAmount}
                error={Boolean(form.fieldError("amount"))}
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

          <FormFieldFrame
            label={LABELS.walletAdjustReason}
            htmlFor="wallet-adjust-reason"
            error={form.fieldError("reason")}
          >
            <Textarea
              id="wallet-adjust-reason"
              value={form.reason}
              placeholder="Provide a detailed audit reason for this points adjustment..."
              rows={3}
              onChange={(e) => form.setReason(e.target.value)}
              error={Boolean(form.fieldError("reason"))}
            />
          </FormFieldFrame>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              disabled={form.loading}
              onClick={() => void form.submit()}
            >
              {form.loading ? LABELS.loading : LABELS.walletAdjustSubmit}
            </Button>
          </div>

          {form.error ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3 text-body-sm text-danger">
              <AlertCircle className="size-4 shrink-0" />
              <span>{form.error}</span>
            </div>
          ) : null}

          {form.message ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-success/20 bg-success/10 p-3 text-body-sm text-success">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{form.message}</span>
            </div>
          ) : null}
        </div>
      </div>
    </RequirePermission>
  );
}
