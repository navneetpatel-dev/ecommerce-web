import { ClipboardCheck, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface PickupChecklistCardProps {
  exchange: boolean;
  otpCode: string;
  onOtpCodeChange: (code: string) => void;
  conditionFiles: File[];
  onConditionFilesChange: (files: File[]) => void;
  replacementFile: File | null;
  onReplacementFileChange: (file: File | null) => void;
  onConfirm: () => void;
  confirmPending: boolean;
  requestCodePending: boolean;
  requestCodeSuccess: boolean;
  expiresInMinutes?: number;
  onRequestCode: () => void;
}

export function PickupChecklistCard({
  exchange,
  otpCode,
  onOtpCodeChange,
  conditionFiles,
  onConditionFilesChange,
  replacementFile,
  onReplacementFileChange,
  onConfirm,
  confirmPending,
  requestCodePending,
  requestCodeSuccess,
  expiresInMinutes,
  onRequestCode,
}: PickupChecklistCardProps) {
  const canSubmit =
    otpCode.length === 6 &&
    (!exchange || (conditionFiles.length > 0 && replacementFile !== null));

  return (
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">Pickup Verification</TextEyebrow>
        </div>
        <span className="text-caption font-medium uppercase tracking-wider text-brand">
          {exchange ? "Exchange" : "Return"}
        </span>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <h2 className="font-display text-[1.125rem] font-medium text-ink">
            Pickup checklist
          </h2>
          <p className="mt-1 text-body-sm text-ink-muted">
            Verify customer code and capture condition photos before receiving
            the item.
          </p>
        </div>

        <div className="rounded-lg border border-line bg-paper/40 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-body-sm font-medium text-ink">
              Customer Pickup Code
            </label>
            <Button
              variant="outline"
              size="sm"
              loading={requestCodePending}
              onClick={onRequestCode}
            >
              Send pickup code
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

        <div className="space-y-3">
          <div className="rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand">
                <Upload className="size-4" aria-hidden="true" />
              </div>
              <span className="text-body-sm font-medium text-ink">
                {conditionFiles.length
                  ? `${conditionFiles.length} condition photo(s) selected`
                  : `Add condition photos${exchange ? " (required)" : " (optional)"}`}
              </span>
              <Input
                className="sr-only"
                type="file"
                multiple
                accept="image/*"
                capture="environment"
                onChange={(e) =>
                  onConditionFilesChange(Array.from(e.target.files ?? []))
                }
              />
            </label>
          </div>

          {exchange ? (
            <div className="rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
                <div className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand">
                  <Upload className="size-4" aria-hidden="true" />
                </div>
                <span className="text-body-sm font-medium text-ink">
                  {replacementFile?.name ??
                    "Add replacement handover proof (required)"}
                </span>
                <Input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) =>
                    onReplacementFileChange(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          ) : null}
        </div>

        <Button
          className="w-full"
          size="lg"
          disabled={!canSubmit}
          loading={confirmPending}
          onClick={onConfirm}
        >
          Confirm collected{exchange ? " and exchanged" : ""}
        </Button>
      </div>
    </div>
  );
}
