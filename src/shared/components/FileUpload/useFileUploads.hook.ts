"use client";

import type { Dispatch, SetStateAction } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  usePresignUpload,
  usePresignUploadBulk,
} from "@/shared/hooks/uploads/useUploads.hook";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { sanitizeUserFacingMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type {
  FileUploadProps,
  MultiProps,
  PreviewEntry,
  SingleProps,
} from "./types";

export function useFileUploads(options: {
  props: FileUploadProps;
  isMultiple: boolean;
  setPreviews: Dispatch<SetStateAction<PreviewEntry[]>>;
  onError: (message: string) => void;
}) {
  const presignOne = usePresignUpload();
  const presignBulk = usePresignUploadBulk();

  const pending = presignOne.isPending || presignBulk.isPending;

  const uploadSingleFile = async (file: File) => {
    const contentType = file.type || "application/octet-stream";
    const result = await presignOne.mutateAsync({
      entityType: options.props.entityType,
      entityId: options.props.entityId,
      purpose: options.props.purpose,
      filename: file.name,
      contentType,
      contentLength: file.size,
      file,
    });
    options.setPreviews([
      { storedUrl: result.url, displayUrl: result.viewUrl ?? result.url },
    ]);
    if (!options.isMultiple) {
      (options.props as SingleProps).onUploaded(result.url);
    }
    return result;
  };

  const uploadMultipleFiles = async (files: File[]) => {
    const result = await presignBulk.mutateAsync({
      entityType: options.props.entityType,
      entityId: options.props.entityId,
      purpose: options.props.purpose,
      files: files.map((file) => ({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        contentLength: file.size,
      })),
      fileObjects: files,
    });

    if (result.errors.length) {
      options.onError(
        result.errors
          .map((e) =>
            formatLabel(LABELS.uploadFileFailedAt, {
              index: String(e.index + 1),
              message: sanitizeUserFacingMessage(
                e.message,
                LABELS.uploadFailed,
              ),
            }),
          )
          .join(" "),
      );
    }

    if (result.items.length) {
      const newEntries = result.items.map((item) => ({
        storedUrl: item.url,
        displayUrl: item.viewUrl ?? item.url,
      }));
      options.setPreviews((prev) => [...prev, ...newEntries]);
      (options.props as MultiProps).onUploaded([
        ...((options.props as MultiProps).valueUrls ?? []),
        ...result.items.map((item) => item.url),
      ]);
    }
  };

  return { pending, uploadMultipleFiles, uploadSingleFile };
}
