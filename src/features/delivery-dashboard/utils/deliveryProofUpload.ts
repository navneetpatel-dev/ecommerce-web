import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import type { usePresignUpload } from "@/shared/hooks/useUploads.hook";

type PresignUpload = ReturnType<typeof usePresignUpload>;

/** Uploads a delivery proof photo if one was picked; returns its URL, or undefined when there's no file. */
export async function uploadDeliveryProofIfPresent(
  upload: PresignUpload,
  shipmentId: string,
  file: File | null,
): Promise<string | undefined> {
  if (!file) return undefined;
  const result = await upload.mutateAsync({
    entityType: UPLOAD_ENTITY.SHIPMENTS,
    entityId: shipmentId,
    purpose: UPLOAD_PURPOSE.PROOF,
    filename: file.name,
    contentType: file.type,
    contentLength: file.size,
    file,
  });
  return result.url;
}
