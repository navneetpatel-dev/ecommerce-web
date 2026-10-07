import type { ChangeEvent } from "react";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
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
    pendingType === type
      ? LABELS.docUploading
      : document
        ? LABELS.docReupload
        : LABELS.docUpload;

  const handleExpiryChange = (event: ChangeEvent<HTMLInputElement>) => {
    onExpiryChange(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files?.[0] ?? null);
  };

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
            aria-label={formatLabel(LABELS.docExpiryAriaLabel, { label })}
            placeholder={LABELS.docExpiryPlaceholder}
            className={styles.dateInput}
            value={expiryValue}
            onChange={handleExpiryChange}
          />
          <label className={styles.uploadButton}>
            {uploadLabel}
            <Input
              className={styles.fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              disabled={pendingType === type}
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
