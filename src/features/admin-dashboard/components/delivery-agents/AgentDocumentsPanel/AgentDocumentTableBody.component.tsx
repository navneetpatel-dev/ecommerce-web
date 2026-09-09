import type { DeliveryAgentDocument } from "@/features/delivery-dashboard";
import { AgentDocumentTableRow } from "./AgentDocumentTableRow.component";

interface AgentDocumentTableBodyProps {
  documents: DeliveryAgentDocument[];
  pendingId: string | null;
  onAct: (docId: string, action: "APPROVE" | "REJECT") => Promise<void>;
}

export function AgentDocumentTableBody({
  documents,
  pendingId,
  onAct,
}: AgentDocumentTableBodyProps) {
  return (
    <tbody>
      {documents.map((doc) => (
        <AgentDocumentTableRow
          key={doc.id}
          doc={doc}
          pendingId={pendingId}
          onAct={onAct}
        />
      ))}
    </tbody>
  );
}
