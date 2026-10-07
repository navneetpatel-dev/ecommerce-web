import type { ChangeEvent } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";
import { failedAttemptSectionStyles as styles } from "../../styles/deliveries/failedAttemptSection.styles";

export function FailedAttemptSection({
  value,
  onChange,
  onSubmit,
  pending,
  placeholder,
  submitLabel,
  title = LABELS.reportDeliveryIssueTitle,
  description = LABELS.reportDeliveryIssueBody,
  photo,
  onPhotoChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  pending?: boolean;
  placeholder: string;
  submitLabel: string;
  bordered?: boolean;
  title?: string;
  description?: string;
  /** When provided, shows an optional evidence-photo upload (e.g. locked gate, wrong address). */
  photo?: File | null;
  onPhotoChange?: (file: File | null) => void;
}) {
  const reasonTooShort = value.trim().length < 3;

  const handleReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    onPhotoChange?.(event.target.files?.[0] ?? null);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <AlertTriangle className={styles.icon} aria-hidden="true" />
          <TextEyebrow className={styles.eyebrow}>{title}</TextEyebrow>
        </div>
        <span className={styles.badge}>{LABELS.exceptionBadge}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.description}>{description}</p>
        <Textarea
          value={value}
          placeholder={placeholder}
          rows={3}
          className={styles.textarea}
          onChange={handleReasonChange}
        />
        {onPhotoChange ? (
          <div className={styles.dropzone}>
            <label className={styles.dropzoneLabel}>
              <div className={styles.uploadIconWrapper}>
                <Upload className={styles.uploadIcon} aria-hidden="true" />
              </div>
              <span className={styles.uploadText}>
                {photo ? photo.name : LABELS.addEvidencePhoto}
              </span>
              <Input
                className={styles.fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        ) : null}
        <DisabledActionHint
          disabled={reasonTooShort}
          message={LABELS.failureReasonMinHint}
          className={styles.submitHintWrapper}
        >
          <Button
            className={styles.submitButton}
            variant="outline"
            disabled={reasonTooShort}
            loading={pending}
            onClick={onSubmit}
          >
            {submitLabel}
          </Button>
        </DisabledActionHint>
      </div>
    </div>
  );
}
