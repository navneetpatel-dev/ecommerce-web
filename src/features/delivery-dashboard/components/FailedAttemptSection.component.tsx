import { AlertTriangle } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
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
