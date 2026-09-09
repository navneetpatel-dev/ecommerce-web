import { AlertTriangle, Upload } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { failedAttemptSectionStyles as styles } from "./failedAttemptSection.styles";

export function FailedAttemptSection({
  value,
  onChange,
  onSubmit,
  pending,
  placeholder,
  submitLabel,
  title = "Report Delivery Issue",
  description = "If the customer is unavailable, the address cannot be reached, or this task cannot be completed, record the reason below:",
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
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <AlertTriangle className={styles.icon} aria-hidden="true" />
          <TextEyebrow className={styles.eyebrow}>{title}</TextEyebrow>
        </div>
        <span className={styles.badge}>Exception</span>
      </div>

      <div className={styles.body}>
        <p className={styles.description}>{description}</p>
        <Textarea
          value={value}
          placeholder={placeholder}
          rows={3}
          className={styles.textarea}
          onChange={(event) => onChange(event.target.value)}
        />
        {onPhotoChange ? (
          <div className={styles.dropzone}>
            <label className={styles.dropzoneLabel}>
              <div className={styles.uploadIconWrapper}>
                <Upload className={styles.uploadIcon} aria-hidden="true" />
              </div>
              <span className={styles.uploadText}>
                {photo ? photo.name : "Add evidence photo (optional)"}
              </span>
              <Input
                className={styles.fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        ) : null}
        <Button
          className={styles.submitButton}
          variant="outline"
          disabled={value.trim().length < 3}
          loading={pending}
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
