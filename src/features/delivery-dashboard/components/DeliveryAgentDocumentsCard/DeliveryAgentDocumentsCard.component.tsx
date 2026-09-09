"use client";

import { FileText } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import {
  useDeliveryProfile,
  useMyDocuments,
} from "../../api/deliveryAgent.queries";
import { latestForType } from "../../utils/deliveryDocumentStatus";
import { useDeliveryAgentDocumentUpload } from "../../hooks/useDeliveryAgentDocumentUpload.hook";
import type { DeliveryAgentDocumentType } from "../../types";
import { DocumentStatusBadge } from "./DocumentStatusBadge.component";
import { ExpiryBadge } from "./ExpiryBadge.component";

const DOCUMENT_TYPES: { type: DeliveryAgentDocumentType; label: string }[] = [
  { type: "ID_PROOF", label: "Government ID proof" },
  { type: "DRIVING_LICENSE", label: "Driving license" },
  { type: "VEHICLE_RC", label: "Vehicle registration (RC)" },
  { type: "ADDRESS_PROOF", label: "Address proof" },
];

/** KYC/verification documents — required before an agent can go on duty. */
export function DeliveryAgentDocumentsCard() {
  const profile = useDeliveryProfile();
  const documents = useMyDocuments();
  const agentId = profile.data?.id;
  const { pendingType, error, expiryInputs, setExpiryInput, handleFile } =
    useDeliveryAgentDocumentUpload(agentId);

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
                {document?.verified ? (
                  <ExpiryBadge expiryDate={document.expiryDate} />
                ) : null}
              </div>
              {canReplace ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="date"
                    aria-label={`${label} expiry date`}
                    placeholder="Expiry date (optional)"
                    className="w-40"
                    value={expiryInputs[type] ?? ""}
                    onChange={(e) => setExpiryInput(type, e.target.value)}
                  />
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
                </div>
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
