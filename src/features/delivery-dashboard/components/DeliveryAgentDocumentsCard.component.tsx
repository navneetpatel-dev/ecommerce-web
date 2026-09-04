"use client";

import { useState } from "react";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import {
  useDeliveryProfile,
  useMyDocuments,
  useSubmitDocument,
} from "../api/deliveryAgent.queries";
import type {
  DeliveryAgentDocument,
  DeliveryAgentDocumentType,
} from "../types";

const DOCUMENT_TYPES: { type: DeliveryAgentDocumentType; label: string }[] = [
  { type: "ID_PROOF", label: "Government ID proof" },
  { type: "DRIVING_LICENSE", label: "Driving license" },
  { type: "VEHICLE_RC", label: "Vehicle registration (RC)" },
  { type: "ADDRESS_PROOF", label: "Address proof" },
];

function latestForType(
  documents: DeliveryAgentDocument[],
  type: DeliveryAgentDocumentType,
): DeliveryAgentDocument | undefined {
  return documents
    .filter((doc) => doc.type === type)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
}

function DocumentStatusBadge({
  document,
}: {
  document?: DeliveryAgentDocument;
}) {
  if (!document) {
    return <span className="text-body-sm text-ink-muted">Not submitted</span>;
  }
  if (document.verified) {
    return (
      <span className="flex items-center gap-1 text-body-sm text-success">
        <CheckCircle2 className="size-3.5" aria-hidden="true" />
        Approved
      </span>
    );
  }
  if (document.rejectedAt) {
    return (
      <span className="flex items-center gap-1 text-body-sm text-danger">
        <XCircle className="size-3.5" aria-hidden="true" />
        Rejected
        {document.rejectionReason ? `: ${document.rejectionReason}` : ""}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-body-sm text-warning">
      <Clock className="size-3.5" aria-hidden="true" />
      Pending review
    </span>
  );
}

/** KYC/verification documents — required before an agent can go on duty. */
export function DeliveryAgentDocumentsCard() {
  const profile = useDeliveryProfile();
  const documents = useMyDocuments();
  const submit = useSubmitDocument();
  const upload = usePresignUpload();
  const [pendingType, setPendingType] =
    useState<DeliveryAgentDocumentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const agentId = profile.data?.id;

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
      await submit.mutateAsync({ type, url: result.url });
    } catch (submitError) {
      setError(
        getApiErrorMessage(submitError, "Could not submit this document."),
      );
    } finally {
      setPendingType(null);
    }
  };

  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-brand" aria-hidden="true" />
          <TextEyebrow className="!mb-0">VERIFICATION</TextEyebrow>
        </div>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          Identity &amp; vehicle documents
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          ID proof and driving license must be approved before you can go
          available for assignment.
        </p>
      </div>
      <div className="divide-y divide-line/60">
        {DOCUMENT_TYPES.map(({ type, label }) => {
          const document = latestForType(documents.data ?? [], type);
          const canReplace = !document?.verified;
          return (
            <div
              key={type}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between md:px-6"
            >
              <div className="space-y-0.5">
                <p className="font-medium text-ink">{label}</p>
                <DocumentStatusBadge document={document} />
              </div>
              {canReplace ? (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-1.5 text-body-sm font-medium text-brand hover:bg-paper/60">
                  {pendingType === type
                    ? "Uploading..."
                    : document
                      ? "Re-upload"
                      : "Upload"}
                  <Input
                    className="sr-only"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    disabled={pendingType === type}
                    onChange={(e) =>
                      void handleFile(type, e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              ) : null}
            </div>
          );
        })}
      </div>
      {error ? (
        <p className="px-5 pb-4 text-body-sm text-danger md:px-6">{error}</p>
      ) : null}
    </section>
  );
}
