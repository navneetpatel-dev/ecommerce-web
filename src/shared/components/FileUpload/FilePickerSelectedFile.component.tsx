import { X, type LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { filePickerSelectedFileStyles } from "../../styles/file-upload/fileUploadComponents.styles";

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
    <div className={filePickerSelectedFileStyles.card}>
      <div className={filePickerSelectedFileStyles.infoGroup}>
        <div className={filePickerSelectedFileStyles.iconWrapper}>
          <Icon
            className={filePickerSelectedFileStyles.icon}
            aria-hidden="true"
          />
        </div>
        <div className={filePickerSelectedFileStyles.textGroup}>
          <p className={filePickerSelectedFileStyles.filename}>{file.name}</p>
          <p className={filePickerSelectedFileStyles.filesize}>
            {formattedSize}
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        onClick={onRemove}
        aria-label={LABELS.remove}
      >
        <X size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
