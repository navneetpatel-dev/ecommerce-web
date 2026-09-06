import type {
  Address,
  OrderItem,
  ReturnRequest,
  Shipment,
} from "@/shared/api/types";

export type DeliveryAgent = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  vehicleType: "BIKE" | "SCOOTER" | "VAN" | "BICYCLE";
  hubOrZone: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  availableForAssignment: boolean;
  activeDeliveries?: number;
  activePickups?: number;
  averageRating?: number | null;
  ratingCount?: number;
  bankDetails?: BankDetails | null;
  user?: { email: string; status: string };
};

export type DeliveryCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export type DeliveryShipment = Shipment & {
  deliveryAgentId: string | null;
  assignedAt: string | null;
  proofOfDeliveryUrl: string | null;
  deliveryOtpVerifiedAt: string | null;
  failureReason: string | null;
  failedAttemptCount: number;
  codAmount: number | null;
  codCollected: boolean;
  preferredRedeliverySlot: string | null;
  attempts?: Array<{
    id: string;
    attemptNumber: number;
    note: string;
    photoUrl: string | null;
    attemptedAt: string;
  }>;
  subOrder?: {
    items?: Pick<OrderItem, "id" | "productName" | "quantity">[];
    order?: {
      id: string;
      userId: string;
      shippingAddress?: Address | null;
      user?: DeliveryCustomer | null;
    };
  };
};

/** A shipment with no agent yet — feeds the admin dispatch picker. */
export type UnassignedShipment = {
  id: string;
  trackingNumber: string;
  status: string;
  createdAt: string;
  orderId: string | null;
  vendorName: string | null;
  /** Destination pincode (from the order's shipping address) — powers zone grouping in the dispatch picker. */
  pincode: string | null;
};

/** A return pickup with no agent yet — feeds the admin dispatch picker. */
export type UnassignedPickup = {
  id: string;
  type: "REFUND" | "EXCHANGE";
  status: string;
  updatedAt: string;
  orderId: string | null;
  productName: string | null;
  customerName: string | null;
  /** Pickup pincode (from the order's shipping address) — powers zone grouping in the dispatch picker. */
  pincode: string | null;
};

export type ShiftSummary = {
  deliveredToday: number;
  pickupsToday: number;
  onTimePercent: number;
  codCashInHand: number;
  pendingEarnings: number;
  earningsToday: number;
  perTaskEarning: number;
  pendingDeposits: number;
};

export type AgentPayoutStatus = "PENDING" | "PAID" | "FAILED";
export type AgentPayoutPaymentMethod =
  "NEFT" | "IMPS" | "UPI" | "RTGS" | "CHEQUE" | "CASH" | "OTHER";

export type AgentPayout = {
  id: string;
  deliveryAgentId: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: AgentPayoutStatus;
  paymentMethod: AgentPayoutPaymentMethod | null;
  paymentReferenceNumber: string | null;
  proofOfPaymentUrl: string | null;
  remarks: string | null;
  failureReason: string | null;
  paidAt: string | null;
  createdAt: string;
  agentName?: string | null;
  agentHubOrZone?: string | null;
};

export type AgentEarning = {
  id: string;
  deliveryAgentId: string;
  sourceType: "DELIVERY" | "PICKUP";
  sourceId: string;
  amount: number;
  status: "PENDING" | "SETTLED";
  payoutId: string | null;
  earnedAt: string;
};

export type BankDetails = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string | null;
};

export type CashDepositStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type CashDeposit = {
  id: string;
  deliveryAgentId: string;
  amount: number;
  expectedAmount: number;
  status: CashDepositStatus;
  note: string | null;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  deliveryAgent?: { id: string; fullName: string; hubOrZone: string };
};

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

export type DeliveryPickup = ReturnRequest & {
  type: "REFUND" | "EXCHANGE";
  deliveryAgentId: string | null;
  pickupOtpVerifiedAt: string | null;
  pickupFailureReason: string | null;
  replacementDeliveredAt: string | null;
  replacementProofUrl: string | null;
  user?: DeliveryCustomer | null;
  orderItem?: { productName: string } | null;
  subOrder?: {
    orderId: string;
    order?: { id: string; shippingAddress?: Address | null };
  };
};
