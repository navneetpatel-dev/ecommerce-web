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
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { filePickerStyles } from "./fileUploadComponents.styles";
import { FilePickerSelectedFile } from "./FilePickerSelectedFile.component";
import { FilePickerDropzone } from "./FilePickerDropzone.component";
import {
  formatFileSize,
  validateFilePickerFile,
} from "@/shared/utils/filePickerValidation";

export { formatFileSize };

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

  const isSheet =
    accept?.includes(".csv") ||
    accept?.includes("text/csv") ||
    accept?.includes(".xlsx") ||
    accept?.includes("spreadsheet");
  const resolvedVariant =
    iconVariant ??
    (isSheet
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

      const error = await validateFilePickerFile(file, {
        maxBytes,
        maxRows,
        validate,
      });
      if (error) {
        reportError(error);
        return;
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

  const resolvedIcon =
    resolvedVariant === "csv"
      ? FileSpreadsheet
      : resolvedVariant === "document"
        ? FileText
        : resolvedVariant === "image"
          ? ImageIcon
          : Upload;

  return (
    <div className={cn(filePickerStyles.root, className)}>
      {label ? (
        <label htmlFor={id} className={filePickerStyles.label}>
          {label}
        </label>
      ) : null}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        className={filePickerStyles.hiddenInput}
        onChange={(e) => {
          const picked = e.target.files?.[0] ?? null;
          void validateAndSelectFile(picked);
        }}
      />

      {value ? (
        <FilePickerSelectedFile
          file={value}
          formattedSize={formatFileSize(value.size)}
          icon={resolvedIcon}
          disabled={disabled}
          onRemove={handleRemove}
        />
      ) : (
        <FilePickerDropzone
          icon={resolvedIcon}
          disabled={disabled}
          hint={hint}
          isDragOver={isDragOver}
          onActivate={() => inputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {localError ? (
        <p className={filePickerStyles.errorText}>
          <AlertCircle
            className={filePickerStyles.errorIcon}
            aria-hidden="true"
          />
          <span>{localError}</span>
        </p>
      ) : null}
    </div>
  );
}
