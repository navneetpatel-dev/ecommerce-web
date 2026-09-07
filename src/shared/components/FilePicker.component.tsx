"use client";

import {
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  AlertCircle,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface FilePickerProps {
  id?: string;
  accept?: string;
  maxBytes?: number;
  maxRows?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  onError?: (error: string | null) => void;
  disabled?: boolean;
  label?: string;
  hint?: string;
  className?: string;
  iconVariant?: "csv" | "document" | "image" | "generic";
  validate?: (file: File) => string | null | Promise<string | null>;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePicker({
  id,
  accept,
  maxBytes,
  maxRows,
  value,
  onChange,
  onError,
  disabled = false,
  label,
  hint,
  className,
  iconVariant,
  validate,
}: FilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const resolvedVariant =
    iconVariant ??
    (accept?.includes(".csv") || accept?.includes("text/csv")
      ? "csv"
      : accept?.includes("image")
        ? "image"
        : accept?.includes("pdf")
          ? "document"
          : "generic");

  const reportError = useCallback(
    (msg: string | null) => {
      setLocalError(msg);
      onError?.(msg);
    },
    [onError],
  );

  const validateAndSelectFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        reportError(null);
        onChange(null);
        return;
      }

      // 1. File size limit check
      if (maxBytes && file.size > maxBytes) {
        reportError(
          `File size exceeds the ${formatFileSize(maxBytes)} limit (chosen: ${formatFileSize(file.size)}).`,
        );
        return;
      }

      // 2. CSV row count check
      if (
        maxRows &&
        (file.name.endsWith(".csv") || file.type.includes("csv"))
      ) {
        try {
          const text = await file.text();
          const lines = text
            .split(/\r?\n/)
            .filter((line) => line.trim().length > 0);
          const rowCount = Math.max(0, lines.length - 1); // exclude header row
          if (rowCount > maxRows) {
            reportError(
              `CSV file exceeds the ${maxRows}-row limit (found ${rowCount} rows).`,
            );
            return;
          }
        } catch {
          // If reading text fails, let the parent component handle parsing errors
        }
      }

      // 3. Custom validator check
      if (validate) {
        const customErr = await validate(file);
        if (customErr) {
          reportError(customErr);
          return;
        }
      }

      reportError(null);
      onChange(file);
    },
    [maxBytes, maxRows, validate, reportError, onChange],
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    void validateAndSelectFile(droppedFile);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleRemove = () => {
    reportError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const renderIcon = () => {
    switch (resolvedVariant) {
      case "csv":
        return (
          <FileSpreadsheet className="size-5 text-brand" aria-hidden="true" />
        );
      case "document":
        return <FileText className="size-5 text-brand" aria-hidden="true" />;
      case "image":
        return <ImageIcon className="size-5 text-brand" aria-hidden="true" />;
      default:
        return <Upload className="size-5 text-brand" aria-hidden="true" />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label htmlFor={id} className="text-body-sm font-medium text-ink block">
          {label}
        </label>
      ) : null}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const picked = e.target.files?.[0] ?? null;
          void validateAndSelectFile(picked);
        }}
      />

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface-raised p-3 shadow-elevation-1 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper/60">
              {renderIcon()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-ink">
                {value.name}
              </p>
              <p className="text-caption text-ink-muted">
                {formatFileSize(value.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            aria-label="Remove selected file"
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={() => !disabled && inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 text-center transition-all cursor-pointer select-none",
            isDragOver
              ? "border-brand bg-brand/5 shadow-xs"
              : "border-line bg-paper/20 hover:border-brand/50 hover:bg-paper/40",
            disabled &&
              "cursor-not-allowed opacity-50 hover:border-line hover:bg-paper/20",
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-full border border-line bg-surface shadow-elevation-1">
            {renderIcon()}
          </div>
          <div className="space-y-0.5">
            <p className="text-body-sm text-ink">
              <span className="font-medium text-brand underline underline-offset-2">
                Click to choose file
              </span>{" "}
              or drag and drop
            </p>
            {hint ? (
              <p className="text-caption text-ink-muted leading-snug">{hint}</p>
            ) : null}
          </div>
        </div>
      )}

      {localError ? (
        <p className="flex items-center gap-1.5 text-body-sm text-danger">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{localError}</span>
        </p>
      ) : null}
    </div>
  );
}
