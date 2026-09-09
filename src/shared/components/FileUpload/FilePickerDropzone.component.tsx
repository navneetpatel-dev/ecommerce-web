import type { DragEvent, KeyboardEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { filePickerDropzoneStyles } from "../../styles/file-upload/fileUploadComponents.styles";

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
        filePickerDropzoneStyles.dropzoneBase,
        isDragOver
          ? filePickerDropzoneStyles.dropzoneActive
          : filePickerDropzoneStyles.dropzoneIdle,
        disabled && filePickerDropzoneStyles.dropzoneDisabled,
      )}
    >
      <div className={filePickerDropzoneStyles.iconWrapper}>
        <Icon className={filePickerDropzoneStyles.icon} aria-hidden="true" />
      </div>
      <div className={filePickerDropzoneStyles.textGroup}>
        <p className={filePickerDropzoneStyles.primaryText}>
          <span className={filePickerDropzoneStyles.actionText}>
            Click to choose file
          </span>{" "}
          or drag and drop
        </p>
        {hint ? (
          <p className={filePickerDropzoneStyles.hintText}>{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
