import { ClipboardCheck, Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { pickupChecklistCardStyles as styles } from "./pickupChecklistCard.styles";

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
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ClipboardCheck className={styles.headerIcon} aria-hidden="true" />
          <TextEyebrow className={styles.eyebrow}>
            Pickup Verification
          </TextEyebrow>
        </div>
        <span className={styles.exchangeBadge}>
          {exchange ? "Exchange" : "Return"}
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <h2 className={styles.title}>Pickup checklist</h2>
          <p className={styles.subtitle}>
            Verify customer code and capture condition photos before receiving
            the item.
          </p>
        </div>

        <div className={styles.codeBox}>
          <div className={styles.codeLabelRow}>
            <label className={styles.codeLabel}>Customer Pickup Code</label>
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
            <p className={styles.codeSuccessText}>
              Code sent. Expires in {expiresInMinutes} minutes.
            </p>
          ) : null}
          <div className={styles.codeInputsRow}>
            <Input
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              placeholder="------"
              className={styles.otpInput}
              onChange={(e) =>
                onOtpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            <span className={styles.digitsCount}>
              {otpCode.length}/6 digits
            </span>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.dropzone}>
            <label className={styles.dropzoneLabel}>
              <div className={styles.uploadIconCircle}>
                <Upload className={styles.uploadIcon} aria-hidden="true" />
              </div>
              <span className={styles.dropzoneText}>
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
            <div className={styles.dropzone}>
              <label className={styles.dropzoneLabel}>
                <div className={styles.uploadIconCircle}>
                  <Upload className={styles.uploadIcon} aria-hidden="true" />
                </div>
                <span className={styles.dropzoneText}>
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
          className={styles.submitButton}
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
