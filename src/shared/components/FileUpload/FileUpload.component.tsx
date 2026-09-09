import { FormError } from "@/shared/components/FormError.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Button } from "@/shared/components/ui/button";
import dynamic from "next/dynamic";
import { LABELS } from "@/shared/constants/labels";
import { fileUploadStyles } from "@/shared/styles/file-upload/fileUploadComponents.styles";
import { useFileUploadController } from "../../hooks/file-upload/useFileUploadController.hook";
import type { FileUploadProps } from "../../types/file-upload/types";
import { isPdfUrl, isVideoUrl } from "../../utils/file-upload/utils";

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
 */
export function FileUpload(props: FileUploadProps) {
  const {
    accept,
    cropSession,
    error,
    fileRef,
    hintText,
    isMultiple,
    onCropCancelled,
    onCropConfirmed,
    onPick,
    pending,
    previewEntries,
    spec,
  } = useFileUploadController(props);

  return (
    <>
      <div className={fileUploadStyles.root}>
        {props.label ? (
          <p className={fileUploadStyles.label}>{props.label}</p>
        ) : null}
        {hintText ? <p className={fileUploadStyles.hint}>{hintText}</p> : null}
        <div className={fileUploadStyles.buttonRow}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={props.disabled || pending || !props.entityId}
            onClick={() => fileRef.current?.click()}
          >
            {pending
              ? LABELS.uploading
              : isMultiple
                ? LABELS.uploadFiles
                : LABELS.uploadFile}
          </Button>
          <input
            ref={fileRef}
            type="file"
            className={fileUploadStyles.hiddenInput}
            accept={accept}
            multiple={isMultiple}
            disabled={props.disabled || pending}
            onChange={(e) => onPick(e.target.files)}
          />
        </div>
        {previewEntries.length > 0 ? (
          <ul className={fileUploadStyles.previewList}>
            {previewEntries.map((entry) =>
              isPdfUrl(entry.displayUrl) ? (
                <li
                  key={entry.storedUrl}
                  className={fileUploadStyles.pdfPreview}
                >
                  {LABELS.pdfPreview}
                </li>
              ) : isVideoUrl(entry.displayUrl) ? (
                <li
                  key={entry.storedUrl}
                  className={fileUploadStyles.videoItem}
                >
                  <video
                    src={entry.displayUrl}
                    className={fileUploadStyles.videoElement}
                    muted
                    playsInline
                    aria-label={LABELS.videoPreview}
                  />
                </li>
              ) : (
                <li
                  key={entry.storedUrl}
                  className={fileUploadStyles.imageItem}
                >
                  <MediaImage
                    src={entry.displayUrl}
                    alt=""
                    sizes="64px"
                    imageClassName={fileUploadStyles.imageElement}
                  />
                </li>
              ),
            )}
          </ul>
        ) : null}
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
          onOpenChange={(open) => {
            if (!open) onCropCancelled();
          }}
          onConfirm={onCropConfirmed}
        />
      ) : null}
    </>
  );
}
