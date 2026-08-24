import { useMutation } from "@tanstack/react-query";
import {
  uploadsApi,
  type UploadBulkBody,
  type UploadSingleBody,
} from "./uploads.api";

// Presign upload hooks are shared infrastructure (used by shared/FileUpload);
// re-exported here so existing feature consumers keep their import paths.
export {
  readFileAsDataUrl,
  usePresignUpload,
  usePresignUploadBulk,
} from "@/shared/hooks/useUploads.hook";

/** Server-side upload (data URL) — used directly for avatars and as presign fallback. */
export function useUploadFile() {
  return useMutation({
    mutationFn: (body: UploadSingleBody) => uploadsApi.upload(body),
  });
}

export function useUploadFilesBulk() {
  return useMutation({
    mutationFn: (body: UploadBulkBody) => uploadsApi.uploadBulk(body),
  });
}
