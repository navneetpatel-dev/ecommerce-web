import type { Address, ReturnRequest, Shipment } from "@/shared/api/types";

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
  subOrder?: {
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
};

export type DeliveryPickup = ReturnRequest & {
  type: "REFUND" | "EXCHANGE";
  deliveryAgentId: string | null;
  pickupOtpVerifiedAt: string | null;
  pickupFailureReason: string | null;
  replacementDeliveredAt: string | null;
  replacementProofUrl: string | null;
  user?: DeliveryCustomer | null;
  subOrder?: {
    orderId: string;
    order?: { id: string; shippingAddress?: Address | null };
  };
};
