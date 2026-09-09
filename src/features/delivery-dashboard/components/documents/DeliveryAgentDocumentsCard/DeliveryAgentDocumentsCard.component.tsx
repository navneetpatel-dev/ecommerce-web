"use client";

import { FileText } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import {
  useDeliveryProfile,
  useMyDocuments,
} from "../../../api/agent/deliveryAgent.queries";
import { latestForType } from "../../../utils/documents/deliveryDocumentStatus";
import { useDeliveryAgentDocumentUpload } from "../../../hooks/documents/useDeliveryAgentDocumentUpload.hook";
import type { DeliveryAgentDocumentType } from "../../../types/agent/types";
import { DocumentStatusBadge } from "./DocumentStatusBadge.component";
import { ExpiryBadge } from "./ExpiryBadge.component";
import { deliveryAgentDocumentsCardStyles as styles } from "../../../styles/documents/deliveryAgentDocumentsCard.styles";

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
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerEyebrowRow}>
          <FileText className={styles.icon} aria-hidden="true" />
          <TextEyebrow className={styles.eyebrow}>VERIFICATION</TextEyebrow>
        </div>
        <h2 className={styles.title}>Identity &amp; vehicle documents</h2>
        <p className={styles.subtitle}>
          ID proof and driving license must be approved before you can go
          available for assignment.
        </p>
      </div>
      <div className={styles.list}>
        {DOCUMENT_TYPES.map(({ type, label }) => {
          const document = latestForType(documents.data ?? [], type);
          const canReplace = !document?.verified;
          return (
            <div key={type} className={styles.row}>
              <div className={styles.docInfo}>
                <p className={styles.docTitle}>{label}</p>
                <DocumentStatusBadge document={document} />
                {document?.verified ? (
                  <ExpiryBadge expiryDate={document.expiryDate} />
                ) : null}
              </div>
              {canReplace ? (
                <div className={styles.actionsRow}>
                  <Input
                    type="date"
                    aria-label={`${label} expiry date`}
                    placeholder="Expiry date (optional)"
                    className={styles.dateInput}
                    value={expiryInputs[type] ?? ""}
                    onChange={(e) => setExpiryInput(type, e.target.value)}
                  />
                  <label className={styles.uploadButton}>
                    {pendingType === type
                      ? "Uploading..."
                      : document
                        ? "Re-upload"
                        : "Upload"}
                    <Input
                      className={styles.fileInput}
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
      {error ? <p className={styles.errorText}>{error}</p> : null}
    </section>
  );
}
