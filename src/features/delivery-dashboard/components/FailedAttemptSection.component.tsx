import { AlertTriangle, Upload } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

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
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
          <TextEyebrow className="!mb-0">{title}</TextEyebrow>
        </div>
        <span className="text-caption font-medium uppercase tracking-wider text-warning">
          Exception
        </span>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-body-sm text-ink-muted leading-relaxed">
          {description}
        </p>
        <Textarea
          value={value}
          placeholder={placeholder}
          rows={3}
          className="resize-none"
          onChange={(event) => onChange(event.target.value)}
        />
        {onPhotoChange ? (
          <div className="rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center">
              <div className="flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand">
                <Upload className="size-4" aria-hidden="true" />
              </div>
              <span className="text-body-sm font-medium text-ink">
                {photo ? photo.name : "Add evidence photo (optional)"}
              </span>
              <Input
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        ) : null}
        <Button
          className="w-full"
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
