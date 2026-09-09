import { apiClient } from "@/shared/api/client";
import { postFile } from "@/shared/api/postFile";
import { downloadReportFile } from "@/features/reports";
import { API } from "@/shared/constants/apiRoutes";
import type {
  BulkCreateAgentResult,
  DeliveryAgentDocument,
  DeliveryAgentDocumentType,
  DeliveryAgentPerformance,
} from "../types";

/** Agent-facing document operations — composed into `deliveryAgentApi`. */
export const deliveryAgentDocumentsApi = {
  submitDocument: (
    type: DeliveryAgentDocumentType,
    url: string,
    expiryDate?: string,
  ) =>
    apiClient.post<DeliveryAgentDocument>(API.deliveryAgents.meDocuments, {
      type,
      url,
      expiryDate: expiryDate || undefined,
    }),
  myDocuments: () =>
    apiClient.get<DeliveryAgentDocument[]>(API.deliveryAgents.meDocuments),
};

/** Admin-facing document/performance/bulk-onboarding operations — composed into `deliveryAdminApi`. */
export const deliveryAdminDocumentsApi = {
  documents: () =>
    apiClient.get<DeliveryAgentDocument[]>(API.deliveryAgents.documents),
  performanceReport: (from?: string, to?: string) => {
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    const qs = query.toString();
    return apiClient.get<DeliveryAgentPerformance[]>(
      `${API.deliveryAgents.performanceReport}${qs ? `?${qs}` : ""}`,
    );
  },
  reviewDocument: (
    documentId: string,
    action: "APPROVE" | "REJECT",
    rejectionReason?: string,
  ) =>
    apiClient.patch<DeliveryAgentDocument>(
      API.deliveryAgents.reviewDocument(documentId),
      { action, rejectionReason },
    ),
  bulkCreate: (
    rows: Array<{
      email: string;
      password: string;
      fullName: string;
      phone: string;
      vehicleType: string;
      hubOrZone: string;
    }>,
  ) =>
    apiClient.post<BulkCreateAgentResult[]>(API.deliveryAgents.bulkCreate, {
      rows,
    }),
  downloadBulkTemplate: async (format: "xlsx" | "csv" = "xlsx") => {
    const filename = `delivery_agents_template.${format}`;
    await downloadReportFile(
      `${API.deliveryAgents.bulkTemplate}?format=${format}`,
      filename,
    );
  },
  bulkImportFile: (file: File) =>
    postFile<BulkCreateAgentResult[]>(API.deliveryAgents.bulkImportFile, file),
};
