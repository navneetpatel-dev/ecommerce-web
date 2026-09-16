import type {
  Address,
  OrderItem,
  ReturnRequest,
  Shipment,
} from "@/shared/api/types";
import type { BankDetails } from "../earnings/deliveryAgentPayouts.types";

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
  pendingEarningsCount: number;
  earningsToday: number;
  perTaskEarning: number;
  pendingDeposits: number;
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
