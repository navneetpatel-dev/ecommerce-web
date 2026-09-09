import { X, type LucideIcon } from "lucide-react";

interface FilePickerSelectedFileProps {
  file: File;
  formattedSize: string;
  icon: LucideIcon;
  disabled?: boolean;
  onRemove: () => void;
}

/** The "file selected" row shown by FilePicker once a file has been chosen. */
export function FilePickerSelectedFile({
  file,
  formattedSize,
  icon: Icon,
  disabled,
  onRemove,
}: FilePickerSelectedFileProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface p-3.5 shadow-elevation-1 transition-colors">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line/70 bg-paper/60">
          <Icon className="size-5 text-brand" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-body-sm font-semibold text-ink">
            {file.name}
          </p>
          <p className="text-caption text-ink-muted">{formattedSize}</p>
        </div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label="Remove selected file"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
