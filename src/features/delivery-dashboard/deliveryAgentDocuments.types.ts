export type DeliveryAgentDocumentType =
  "ID_PROOF" | "DRIVING_LICENSE" | "VEHICLE_RC" | "ADDRESS_PROOF";

export type DeliveryAgentDocument = {
  id: string;
  deliveryAgentId: string;
  type: DeliveryAgentDocumentType;
  url: string;
  verified: boolean;
  rejectionReason: string | null;
  rejectedAt: string | null;
  expiryDate: string | null;
  createdAt: string;
  deliveryAgent?: { id: string; fullName: string; hubOrZone: string };
};

export type DeliveryAgentPerformance = {
  deliveryAgentId: string;
  fullName: string;
  hubOrZone: string;
  delivered: number;
  rto: number;
  rtoRatePercent: number;
  failedAttempts: number;
  avgFulfillmentHours: number | null;
  averageRating: number | null;
  ratingCount: number;
  flagged: boolean;
  flagReason: string | null;
};

export type StaleShipment = {
  id: string;
  trackingNumber: string;
  status: string;
  updatedAt: string;
  deliveryAgent: { id: string; fullName: string } | null;
};

export type StalePickup = {
  id: string;
  status: string;
  updatedAt: string;
  pickupFailureReason: string | null;
  deliveryAgent: { id: string; fullName: string } | null;
};

export type StaleTasksReport = {
  shipments: StaleShipment[];
  pickups: StalePickup[];
};

export type BulkCreateAgentResult = {
  row: number;
  email: string;
  success: boolean;
  error: string | null;
};

export type DeliveryAgentRatingItem = {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};

export type DeliveryAgentRatings = {
  averageRating: number;
  ratingCount: number;
  ratings: DeliveryAgentRatingItem[];
};
