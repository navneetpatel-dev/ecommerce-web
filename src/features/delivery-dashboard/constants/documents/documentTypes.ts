import type { DeliveryAgentDocumentType } from "../../types/agent/types";

export const DELIVERY_AGENT_DOCUMENT_TYPES: {
  type: DeliveryAgentDocumentType;
  label: string;
}[] = [
  { type: "ID_PROOF", label: "Government ID proof" },
  { type: "DRIVING_LICENSE", label: "Driving license" },
  { type: "VEHICLE_RC", label: "Vehicle registration (RC)" },
  { type: "ADDRESS_PROOF", label: "Address proof" },
];
