"use client";

import { useState } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { usePresignUpload } from "@/shared/hooks/uploads/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import { useSubmitDocument } from "../../api/agent/deliveryAgent.queries";
import type { DeliveryAgentDocumentType } from "../../types/agent/types";

/** Owns the upload-one-document flow: presigned upload, submit, and its transient UI state. */
export function useDeliveryAgentDocumentUpload(agentId: string | undefined) {
  const submit = useSubmitDocument();
  const upload = usePresignUpload();
  const [pendingType, setPendingType] =
    useState<DeliveryAgentDocumentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expiryInputs, setExpiryInputs] = useState<
    Partial<Record<DeliveryAgentDocumentType, string>>
  >({});

  const setExpiryInput = (type: DeliveryAgentDocumentType, value: string) => {
    setExpiryInputs((prev) => ({ ...prev, [type]: value }));
  };

  const handleFile = async (
    type: DeliveryAgentDocumentType,
    file: File | null,
  ) => {
    if (!file || !agentId) return;
    setError(null);
    setPendingType(type);
    try {
      const result = await upload.mutateAsync({
        entityType: UPLOAD_ENTITY.DELIVERY_AGENT_DOCUMENTS,
        entityId: agentId,
        purpose: UPLOAD_PURPOSE.KYC,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        contentLength: file.size,
        file,
      });
      await submit.mutateAsync({
        type,
        url: result.url,
        expiryDate: expiryInputs[type],
      });
    } catch (submitError) {
      setError(
        getApiErrorMessage(submitError, "Could not submit this document."),
      );
    } finally {
      setPendingType(null);
    }
  };

  return {
    pendingType,
    error,
    expiryInputs,
    setExpiryInput,
    handleFile,
  };
}
