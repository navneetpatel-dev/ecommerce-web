"use client";

import { useMutation } from "@tanstack/react-query";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  putFileToPresignedUrl,
  uploadsApi,
  type PresignBulkBody,
  type PresignSingleBody,
  type PresignSingleResult,
  type UploadSingleBody,
} from "@/shared/api/uploads.api";

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/** Server-side Phase-1 upload — avoids browser → S3 CORS requirements. */
async function uploadViaServer(
  body: UploadSingleBody,
): Promise<Pick<PresignSingleResult, "url" | "viewUrl">> {
  return uploadsApi.upload(body);
}

/**
 * Try pre-signed PUT; on failure (e.g. S3 CORS) fall back to server upload.
 */
async function uploadSingleWithFallback(
  body: PresignSingleBody & { file: File },
): Promise<PresignSingleResult> {
  try {
    const presign = await uploadsApi.presign({
      entityType: body.entityType,
      entityId: body.entityId,
      purpose: body.purpose,
      filename: body.filename,
      contentType: body.contentType,
      contentLength: body.contentLength,
    });
    await putFileToPresignedUrl(presign.uploadUrl, body.file, body.contentType);
    return presign;
  } catch {
    const dataUrl = await readFileAsDataUrl(body.file);
    const uploaded = await uploadViaServer({
      entityType: body.entityType,
      entityId: body.entityId,
      purpose: body.purpose,
      file: { dataUrl, filename: body.filename },
    });
    return {
      uploadUrl: "",
      url: uploaded.url,
      viewUrl: uploaded.viewUrl,
      key: "",
    };
  }
}

export function usePresignUpload() {
  return useMutation({
    mutationFn: uploadSingleWithFallback,
  });
}

export function usePresignUploadBulk() {
  return useMutation({
    mutationFn: async (body: PresignBulkBody & { fileObjects: File[] }) => {
      const presign = await uploadsApi.presignBulk({
        entityType: body.entityType,
        entityId: body.entityId,
        purpose: body.purpose,
        files: body.files,
      });

      const uploaded: typeof presign.items = [];
      const errors = [...presign.errors];

      for (const item of presign.items) {
        const file = body.fileObjects[item.index];
        if (!file) continue;
        try {
          await putFileToPresignedUrl(
            item.uploadUrl,
            file,
            file.type || "application/octet-stream",
          );
          uploaded.push(item);
        } catch {
          try {
            const dataUrl = await readFileAsDataUrl(file);
            const result = await uploadViaServer({
              entityType: body.entityType,
              entityId: body.entityId,
              purpose: body.purpose,
              file: { dataUrl, filename: file.name },
            });
            uploaded.push({
              index: item.index,
              uploadUrl: "",
              url: result.url,
              viewUrl: result.viewUrl,
              key: "",
            });
          } catch (error) {
            errors.push({
              index: item.index,
              message: getApiErrorMessage(error, LABELS.uploadFailed),
            });
          }
        }
      }

      return { items: uploaded, errors };
    },
  });
}
