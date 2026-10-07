"use client";

import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import {
  resolveFilePickerIcon,
  resolveFilePickerVariant,
} from "@/shared/utils/uploads/filePickerIcon";
import { filePickerStyles } from "../../styles/file-upload/fileUploadComponents.styles";
import { FilePickerSelectedFile } from "./FilePickerSelectedFile.component";
import { FilePickerDropzone } from "./FilePickerDropzone.component";
import {
  formatFileSize,
  validateFilePickerFile,
} from "@/shared/utils/uploads/filePickerValidation";

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void validateAndSelectFile(event.target.files?.[0] ?? null);
  };

  const handleActivate = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    void validateAndSelectFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleRemove = () => {
    reportError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const resolvedIcon = resolveFilePickerIcon(
    resolveFilePickerVariant(accept, iconVariant),
  );

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
        onChange={handleFileChange}
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
          onActivate={handleActivate}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {localError ? (
        <p role="alert" className={filePickerStyles.errorText}>
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
