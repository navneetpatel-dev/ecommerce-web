import { Input } from "@/shared/components/ui/input";
import { latestForType } from "../../../utils/documents/deliveryDocumentStatus";
import type {
  DeliveryAgentDocument,
  DeliveryAgentDocumentType,
} from "../../../types/agent/types";
import { DocumentStatusBadge } from "./DocumentStatusBadge.component";
import { ExpiryBadge } from "./ExpiryBadge.component";
import { deliveryAgentDocumentsCardStyles as styles } from "../../../styles/documents/deliveryAgentDocumentsCard.styles";

interface DocumentTypeRowProps {
  type: DeliveryAgentDocumentType;
  label: string;
  documents: DeliveryAgentDocument[];
  pendingType: DeliveryAgentDocumentType | null;
  expiryValue: string;
  onExpiryChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
}

export function DocumentTypeRow({
  type,
  label,
  documents,
  pendingType,
  expiryValue,
  onExpiryChange,
  onFileChange,
}: DocumentTypeRowProps) {
  const document = latestForType(documents, type);
  const canReplace = !document?.verified;
  const uploadLabel =
    pendingType === type ? "Uploading..." : document ? "Re-upload" : "Upload";

  return (
    <div className={styles.row}>
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
            value={expiryValue}
            onChange={(e) => onExpiryChange(e.target.value)}
          />
          <label className={styles.uploadButton}>
            {uploadLabel}
            <Input
              className={styles.fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              disabled={pendingType === type}
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
