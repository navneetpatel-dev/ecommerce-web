import type { ChangeEvent } from "react";
import { FormError } from "@/shared/components/forms/FormError.component";
import { useFieldControl } from "@/shared/components/forms/fieldControl.context";
import { Button } from "@/shared/components/ui/button";
import dynamic from "next/dynamic";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  fileUploadCardStyles,
  fileUploadStyles,
} from "@/shared/styles/file-upload/fileUploadComponents.styles";
import { useFileUploadController } from "../../hooks/file-upload/useFileUploadController.hook";
import type { FileUploadProps } from "../../types/file-upload/types";
import { FileUploadPreviewList } from "./FileUploadPreviewList.component";

/** Rendered only while a crop session is active (overlay/dialog), so no skeleton fallback is needed. */
const ImageCropDialog = dynamic(
  () =>
    import("@/shared/components/ImageCropDialog").then(
      (mod) => mod.ImageCropDialog,
    ),
  { loading: () => null },
);

/**
 * Phase-1 uploader — crop/resize when required, pre-signed PUT to S3, returns URL(s) for Phase-2 attach.
 * `variant="card"` is the roomy version (rules, counter, large previews, Remove / Replace).
 */
export function FileUpload(props: FileUploadProps) {
  const {
    accept,
    attachedCount,
    cropSession,
    error,
    fileRef,
    hintText,
    isMultiple,
    limitReached,
    maxFiles,
    onCropCancelled,
    onCropConfirmed,
    onPick,
    pending,
    previewEntries,
    removeUrl,
    spec,
  } = useFileUploadController(props);

  const fieldControl = useFieldControl();
  const card = props.variant === "card";
  const styles = card ? fileUploadCardStyles : fileUploadStyles;
  const hasFiles = previewEntries.length > 0;

  const handlePickClick = () => {
    fileRef.current?.click();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onPick(event.target.files);
  };

  const handleCropOpenChange = (open: boolean) => {
    if (!open) onCropCancelled();
  };

  const pickLabel = pending
    ? LABELS.uploading
    : isMultiple
      ? LABELS.uploadFiles
      : hasFiles && card
        ? LABELS.replaceFile
        : LABELS.uploadFile;

  const counter =
    card && isMultiple && maxFiles !== undefined ? (
      <span
        className={
          limitReached
            ? fileUploadCardStyles.counterFull
            : fileUploadCardStyles.counter
        }
        aria-live="polite"
      >
        {formatLabel(LABELS.imagesCount, {
          count: attachedCount,
          max: maxFiles,
        })}
      </span>
    ) : null;

  const removeHandler = props.removable ? removeUrl : undefined;

  return (
    <>
      <div
        className={styles.root}
        {...(fieldControl
          ? {
              role: "group" as const,
              "aria-describedby": fieldControl.describedById,
              "aria-invalid": fieldControl.invalid ? true : undefined,
            }
          : {})}
      >
        {card ? (
          <div className={fileUploadCardStyles.header}>
            <div className={fileUploadCardStyles.headerText}>
              {props.label ? (
                <p className={fileUploadCardStyles.label}>{props.label}</p>
              ) : null}
              {hintText ? (
                <p className={fileUploadCardStyles.hint}>{hintText}</p>
              ) : null}
            </div>
            {counter}
          </div>
        ) : (
          <>
            {props.label ? (
              <p className={fileUploadStyles.label}>{props.label}</p>
            ) : null}
            {hintText ? (
              <p className={fileUploadStyles.hint}>{hintText}</p>
            ) : null}
          </>
        )}
        <div className={styles.buttonRow}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              props.disabled || pending || !props.entityId || limitReached
            }
            onClick={handlePickClick}
          >
            {pickLabel}
          </Button>
          <input
            ref={fileRef}
            type="file"
            className={fileUploadStyles.hiddenInput}
            accept={accept}
            multiple={isMultiple}
            disabled={props.disabled || pending || limitReached}
            onChange={handleInputChange}
          />
        </div>
        <FileUploadPreviewList
          entries={previewEntries}
          card={card}
          markFirstAsMain={Boolean(
            isMultiple &&
            (props as { markFirstAsMain?: boolean }).markFirstAsMain,
          )}
          onRemove={props.disabled ? undefined : removeHandler}
        />
        <FormError
          error={error ? new Error(error) : null}
          fallback={LABELS.uploadFailed}
        />
      </div>

      {spec?.cropRequired && cropSession ? (
        <ImageCropDialog
          open
          imageSrc={cropSession.objectUrl}
          aspectRatio={spec.aspectRatio}
          outputWidth={spec.outputWidth}
          outputHeight={spec.outputHeight}
          sourceFilename={cropSession.filename}
          mimeType={cropSession.mimeType}
          onOpenChange={handleCropOpenChange}
          onConfirm={onCropConfirmed}
        />
      ) : null}
    </>
  );
}
