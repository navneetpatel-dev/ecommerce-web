import { IndianRupee, ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface DoorstepConfirmCardProps {
  otpCode: string;
  onOtpCodeChange: (code: string) => void;
  proof: File | null;
  onProofChange: (file: File | null) => void;
  onConfirm: () => void;
  confirmPending: boolean;
  requestCodePending: boolean;
  requestCodeSuccess: boolean;
  expiresInMinutes?: number;
  onRequestCode: () => void;
  codAmount?: number | null;
  codCollected?: boolean;
  onCodCollectedChange?: (collected: boolean) => void;
}

export function DoorstepConfirmCard({
  otpCode,
  onOtpCodeChange,
  proof,
  onProofChange,
  onConfirm,
  confirmPending,
  requestCodePending,
  requestCodeSuccess,
  expiresInMinutes,
  onRequestCode,
  codAmount,
  codCollected = false,
  onCodCollectedChange,
}: DoorstepConfirmCardProps) {
  const isCod = codAmount != null;
  const canSubmit = otpCode.length === 6 && (!isCod || codCollected);
  return (
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">Doorstep Verification</TextEyebrow>
        </div>
        <span className="text-caption font-medium uppercase tracking-wider text-brand">
          Final Step
        </span>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <h2 className="font-display text-[1.125rem] font-medium text-ink">
            Confirm at the doorstep
          </h2>
          <p className="mt-1 text-body-sm text-ink-muted">
            Enter the customer&apos;s six-digit passcode to verify package
            handover.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-paper/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-body-sm font-medium text-ink">
              Delivery Passcode
            </label>
            <Button
              variant="outline"
              size="sm"
              loading={requestCodePending}
              onClick={onRequestCode}
            >
              Send new delivery code
            </Button>
          </div>
          {requestCodeSuccess && expiresInMinutes ? (
            <p className="text-body-sm text-success">
              Code sent. Expires in {expiresInMinutes} minutes.
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <Input
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              placeholder="------"
              className="max-w-[180px] text-center font-mono text-xl tracking-[0.25em] font-semibold"
              onChange={(e) =>
                onOtpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            <span className="text-caption text-ink-muted">
              {otpCode.length}/6 digits
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand">
              <Upload className="size-4" aria-hidden="true" />
            </div>
            <span className="text-body-sm font-medium text-ink">
              {proof ? proof.name : "Add proof of delivery photo (optional)"}
            </span>
            <Input
              className="sr-only"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => onProofChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {isCod ? (
          <div className="rounded-lg border border-line bg-warning/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-body-sm font-medium text-ink">
              <IndianRupee className="size-4 text-warning" aria-hidden="true" />
              Cash on delivery: collect ₹{codAmount.toFixed(2)}
            </div>
            <CheckboxField
              id="doorstep-cod-collected"
              checked={codCollected}
              onCheckedChange={(checked) => onCodCollectedChange?.(checked)}
              label={`I have collected ₹${codAmount.toFixed(2)} in cash from the customer`}
            />
          </div>
        ) : null}

        <Button
          className="w-full"
          size="lg"
          disabled={!canSubmit}
          loading={confirmPending}
          onClick={onConfirm}
        >
          Confirm delivered
        </Button>
      </div>
    </div>
  );
}
