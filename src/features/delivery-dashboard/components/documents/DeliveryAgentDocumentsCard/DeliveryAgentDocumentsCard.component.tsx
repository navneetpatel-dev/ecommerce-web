"use client";

import { FileText } from "lucide-react";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import {
  useDeliveryProfile,
  useMyDocuments,
} from "../../../api/agent/deliveryAgent.queries";
import { useDeliveryAgentDocumentUpload } from "../../../hooks/documents/useDeliveryAgentDocumentUpload.hook";
import { DELIVERY_AGENT_DOCUMENT_TYPES } from "../../../constants/documents/documentTypes";
import { DocumentTypeRow } from "./DocumentTypeRow.component";
import { deliveryAgentDocumentsCardStyles as styles } from "../../../styles/documents/deliveryAgentDocumentsCard.styles";

/** KYC/verification documents — required before an agent can go on duty. */
export function DeliveryAgentDocumentsCard() {
  const profile = useDeliveryProfile();
  const documents = useMyDocuments();
  const agentId = profile.data?.id;
  const { pendingType, error, expiryInputs, setExpiryInput, handleFile } =
    useDeliveryAgentDocumentUpload(agentId);
  const documentRows = documents.data ?? [];

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
        {DELIVERY_AGENT_DOCUMENT_TYPES.map(({ type, label }) => {
          const handleExpiryChange = (value: string) =>
            setExpiryInput(type, value);
          const handleFileChange = (file: File | null) =>
            void handleFile(type, file);
          return (
            <DocumentTypeRow
              key={type}
              type={type}
              label={label}
              documents={documentRows}
              pendingType={pendingType}
              expiryValue={expiryInputs[type] ?? ""}
              onExpiryChange={handleExpiryChange}
              onFileChange={handleFileChange}
            />
          );
        })}
      </div>
      {error ? (
        <p role="alert" className={styles.errorText}>
          {error}
        </p>
      ) : null}
    </section>
  );
}
