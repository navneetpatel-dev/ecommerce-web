import type { DragEvent, KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface FilePickerDropzoneProps {
  icon: LucideIcon;
  disabled?: boolean;
  hint?: string;
  isDragOver: boolean;
  onActivate: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}

/** The empty-state "click or drag and drop" target shown before a file is chosen. */
export function FilePickerDropzone({
  icon: Icon,
  disabled,
  hint,
  isDragOver,
  onActivate,
  onKeyDown,
  onDragOver,
  onDragLeave,
  onDrop,
}: FilePickerDropzoneProps) {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && onActivate()}
      onKeyDown={onKeyDown}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-7 text-center transition-all cursor-pointer select-none",
        isDragOver
          ? "border-brand bg-brand/10 shadow-xs"
          : "border-line-strong/70 bg-paper/20 hover:border-brand/60 hover:bg-paper/40",
        disabled &&
          "cursor-not-allowed opacity-50 hover:border-line hover:bg-paper/20",
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-xl border border-line/80 bg-surface shadow-xs">
        <Icon className="size-5 text-brand" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-body-sm text-ink">
          <span className="font-semibold text-brand underline underline-offset-4 decoration-brand/40 hover:decoration-brand">
            Click to choose file
          </span>{" "}
          or drag and drop
        </p>
        {hint ? <p className="text-caption text-ink-muted">{hint}</p> : null}
      </div>
    </div>
  );
}
