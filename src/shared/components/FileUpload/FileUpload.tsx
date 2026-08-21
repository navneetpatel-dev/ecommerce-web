import { FormError } from "@/shared/components/FormError";
import { MediaImage } from "@/shared/components/MediaImage";
import { Button } from "@/shared/components/ui/button";
import dynamic from "next/dynamic";
import { LABELS } from "@/shared/constants/labels";
import { useFileUploadController } from "./useFileUploadController";
import type { FileUploadProps } from "./types";
import { isPdfUrl, isVideoUrl } from "./utils";

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
      <div className="space-y-2">
        {props.label ? (
          <p className="text-[0.8125rem] font-medium text-ink">{props.label}</p>
        ) : null}
        {hintText ? (
          <p className="text-[0.8125rem] leading-snug text-ink-muted">
            {hintText}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
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
            className="sr-only"
            accept={accept}
            multiple={isMultiple}
            disabled={props.disabled || pending}
            onChange={(e) => onPick(e.target.files)}
          />
        </div>
        {previewEntries.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {previewEntries.map((entry) =>
              isPdfUrl(entry.displayUrl) ? (
                <li
                  key={entry.storedUrl}
                  className="flex h-16 min-w-[4rem] items-center justify-center border border-line bg-paper px-2 text-[0.6875rem] text-ink-muted"
                >
                  {LABELS.pdfPreview}
                </li>
              ) : isVideoUrl(entry.displayUrl) ? (
                <li
                  key={entry.storedUrl}
                  className="relative h-16 w-24 overflow-hidden border border-line bg-paper"
                >
                  <video
                    src={entry.displayUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    aria-label={LABELS.videoPreview}
                  />
                </li>
              ) : (
                <li
                  key={entry.storedUrl}
                  className="relative h-16 w-16 overflow-hidden border border-line bg-paper"
                >
                  <MediaImage
                    src={entry.displayUrl}
                    alt=""
                    sizes="64px"
                    imageClassName="object-cover"
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
