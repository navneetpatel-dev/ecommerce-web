import type {
  DeliveryAgentDocument,
  DeliveryAgentDocumentType,
} from "../types";

export function latestForType(
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

export function daysUntil(dateString: string): number {
  return Math.ceil(
    (new Date(dateString).getTime() - Date.now()) / (24 * 60 * 60 * 1000),
  );
}
