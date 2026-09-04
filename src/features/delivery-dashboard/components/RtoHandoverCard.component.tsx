import { Undo2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface RtoHandoverCardProps {
  otpCode: string;
  onOtpCodeChange: (code: string) => void;
  onConfirm: () => void;
  confirmPending: boolean;
  requestCodePending: boolean;
  requestCodeSuccess: boolean;
  expiresInMinutes?: number;
  onRequestCode: () => void;
}

/** Vendor hub handover acknowledgment for an RTO parcel — mirrors the customer doorstep OTP flow. */
export function RtoHandoverCard({
  otpCode,
  onOtpCodeChange,
  onConfirm,
  confirmPending,
  requestCodePending,
  requestCodeSuccess,
  expiresInMinutes,
  onRequestCode,
}: RtoHandoverCardProps) {
  return (
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Undo2 className="size-4 text-warning" aria-hidden="true" />
          <TextEyebrow className="!mb-0">Return to Origin</TextEyebrow>
        </div>
        <span className="text-caption font-medium uppercase tracking-wider text-warning">
          Vendor Handover
        </span>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <h2 className="font-display text-[1.125rem] font-medium text-ink">
            Hand this parcel back to the seller
          </h2>
          <p className="mt-1 text-body-sm text-ink-muted">
            Delivery failed after 3 attempts. Ask the vendor for the handover
            code they received by email to confirm they&apos;ve received the
            parcel back.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-paper/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-body-sm font-medium text-ink">
              Vendor Handover Code
            </label>
            <Button
              variant="outline"
              size="sm"
              loading={requestCodePending}
              onClick={onRequestCode}
            >
              Send handover code
            </Button>
          </div>
          {requestCodeSuccess && expiresInMinutes ? (
            <p className="text-body-sm text-success">
              Code sent to the vendor. Expires in {expiresInMinutes} minutes.
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

        <Button
          className="w-full"
          size="lg"
          disabled={otpCode.length !== 6}
          loading={confirmPending}
          onClick={onConfirm}
        >
          Confirm handover
        </Button>
      </div>
    </div>
  );
}
