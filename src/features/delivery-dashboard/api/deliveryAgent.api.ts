import { apiClient } from "@/shared/api/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  AgentEarning,
  AgentPayout,
  AgentPayoutPaymentMethod,
  BankDetails,
  CashDeposit,
  DeliveryAgent,
  DeliveryPickup,
  DeliveryShipment,
  ShiftSummary,
  UnassignedPickup,
  UnassignedShipment,
} from "../types";
import {
  cacheDeliverySnapshot,
  getCachedDeliverySnapshot,
} from "../offline/deliveryOfflineCache";
import {
  enqueueStatusUpdate,
  isOffline,
} from "../offline/deliveryOfflineQueue";

function statusQuery(statuses?: string[]): string {
  return statuses?.length
    ? `?status=${encodeURIComponent(statuses.join(","))}`
    : "";
}

/** Read-through IndexedDB cache so today's task list still renders with no connectivity. */
async function withOfflineCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  try {
    const fresh = await fetcher();
    void cacheDeliverySnapshot(cacheKey, fresh);
    return fresh;
  } catch (error) {
    const cached = await getCachedDeliverySnapshot<T>(cacheKey);
    if (cached !== null) return cached;
    throw error;
  }
}

export const deliveryAgentApi = {
  profile: () => apiClient.get<DeliveryAgent>(API.deliveryAgents.meProfile),
  myDeliveries: (statuses?: string[]) =>
    withOfflineCache(`deliveries:${(statuses ?? []).join(",")}`, () =>
      apiClient.get<DeliveryShipment[]>(
        `${API.deliveryAgents.meDeliveries}${statusQuery(statuses)}`,
      ),
    ),
  delivery: (shipmentId: string) =>
    withOfflineCache(`delivery:${shipmentId}`, () =>
      apiClient.get<DeliveryShipment>(
        API.deliveryAgents.meDelivery(shipmentId),
      ),
    ),
  myPickups: (statuses?: string[]) =>
    withOfflineCache(`pickups:${(statuses ?? []).join(",")}`, () =>
      apiClient.get<DeliveryPickup[]>(
        `${API.deliveryAgents.mePickups}${statusQuery(statuses)}`,
      ),
    ),
  pickup: (returnId: string) =>
    apiClient.get<DeliveryPickup>(API.deliveryAgents.mePickup(returnId)),
  updateLocation: (lat: number, lng: number) =>
    apiClient.patch<{ lat: number; lng: number; updatedAt: string }>(
      API.deliveryAgents.meLocation,
      { lat, lng },
    ),
  shiftSummary: () =>
    apiClient.get<ShiftSummary>(API.deliveryAgents.meShiftSummary),
  closeCashShift: (amount: number, note?: string) =>
    apiClient.post<CashDeposit>(API.deliveryAgents.meCashShiftClose, {
      amount,
      note,
    }),
  myCashDeposits: () =>
    apiClient.get<CashDeposit[]>(API.deliveryAgents.meCashDeposits),
  requestRtoHandoverCode: (shipmentId: string) =>
    apiClient.post<{ sent: boolean; expiresInMinutes: number }>(
      API.deliveryAgents.meRtoHandoverRequestCode(shipmentId),
    ),
  confirmRtoHandover: (shipmentId: string, otpCode: string) =>
    apiClient.post<DeliveryShipment>(
      API.deliveryAgents.meRtoHandoverConfirm(shipmentId),
      {
        otpCode,
      },
    ),
  myPayouts: () => apiClient.get<AgentPayout[]>(API.deliveryAgents.mePayouts),
  myEarningsLedger: () =>
    apiClient.get<AgentEarning[]>(API.deliveryAgents.meEarnings),
  updateBankDetails: (bankDetails: BankDetails) =>
    apiClient.patch<BankDetails>(API.deliveryAgents.meBankDetails, bankDetails),
  requestPickupCode: (returnId: string) =>
    apiClient.post<{ sent: boolean; expiresInMinutes: number }>(
      API.deliveryAgents.mePickupRequestCode(returnId),
    ),
  updateDeliveryStatus: async (
    shipmentId: string,
    body: { status: string; note?: string },
  ) => {
    if (isOffline()) {
      await enqueueStatusUpdate({ kind: "delivery", shipmentId, ...body });
      return null;
    }
    return apiClient.patch<DeliveryShipment>(
      API.deliveryAgents.meDeliveryStatus(shipmentId),
      body,
    );
  },
  requestDeliveryCode: (shipmentId: string) =>
    apiClient.post<{ sent: boolean; expiresInMinutes: number }>(
      API.deliveryAgents.meDeliveryRequestCode(shipmentId),
    ),
  confirmDelivery: (
    shipmentId: string,
    body: { otpCode: string; proofPhotoUrl?: string; codCollected?: boolean },
  ) =>
    apiClient.post<DeliveryShipment>(
      API.deliveryAgents.meDeliveryConfirm(shipmentId),
      body,
    ),
  updatePickupStatus: async (returnId: string, note: string) => {
    if (isOffline()) {
      await enqueueStatusUpdate({ kind: "pickup", returnId, note });
      return null;
    }
    return apiClient.patch<DeliveryPickup>(
      API.deliveryAgents.mePickupStatus(returnId),
      { status: "FAILED", note },
    );
  },
  confirmPickup: (
    returnId: string,
    body: {
      otpCode: string;
      itemConditionPhotoUrls?: string[];
      replacementProofUrl?: string;
    },
  ) =>
    apiClient.post<DeliveryPickup>(
      API.deliveryAgents.mePickupConfirm(returnId),
      body,
    ),
  setAvailability: (availableForAssignment: boolean) =>
    apiClient.patch<DeliveryAgent>(API.deliveryAgents.meAvailability, {
      availableForAssignment,
    }),
};

export const deliveryAdminApi = {
  list: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<DeliveryAgent>> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const response = await apiClient.getWithResponse<DeliveryAgent[]>(
      `${API.deliveryAgents.list}?${query}`,
    );
    return unwrapPaginatedList(response);
  },
  unassignedShipments: () =>
    apiClient.get<UnassignedShipment[]>(API.deliveryAgents.unassignedShipments),
  unassignedPickups: () =>
    apiClient.get<UnassignedPickup[]>(API.deliveryAgents.unassignedPickups),
  bulkAssignShipments: (shipmentIds: string[], deliveryAgentId: string) =>
    apiClient.post<{ assigned: number }>(
      API.deliveryAgents.bulkAssignShipments,
      {
        shipmentIds,
        deliveryAgentId,
      },
    ),
  rtoShipments: () =>
    apiClient.get<DeliveryShipment[]>(API.deliveryAgents.rtoShipments),
  cashDeposits: () =>
    apiClient.get<CashDeposit[]>(API.deliveryAgents.cashDeposits),
  verifyCashDeposit: (
    depositId: string,
    action: "VERIFY" | "REJECT",
    rejectionReason?: string,
  ) =>
    apiClient.patch<CashDeposit>(
      API.deliveryAgents.verifyCashDeposit(depositId),
      {
        action,
        rejectionReason,
      },
    ),
  payouts: () =>
    apiClient.get<AgentPayout[]>(`${API.deliveryAgents.payouts}?limit=100`),
  processPayouts: () =>
    apiClient.post<AgentPayout[]>(API.deliveryAgents.processPayouts, {}),
  markPayoutPaid: (
    payoutId: string,
    body: {
      paymentMethod: AgentPayoutPaymentMethod;
      paymentReferenceNumber: string;
      paidAt?: string;
      proofOfPaymentUrl?: string;
      remarks?: string;
    },
  ) =>
    apiClient.patch<AgentPayout>(
      API.deliveryAgents.markPayoutPaid(payoutId),
      body,
    ),
  markPayoutFailed: (payoutId: string, reason: string) =>
    apiClient.patch<AgentPayout>(
      API.deliveryAgents.markPayoutFailed(payoutId),
      { reason },
    ),
  retryPayout: (payoutId: string) =>
    apiClient.patch<AgentPayout>(API.deliveryAgents.retryPayout(payoutId), {}),
  create: (body: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    vehicleType: string;
    hubOrZone: string;
  }) => apiClient.post<DeliveryAgent>(API.deliveryAgents.create, body),
  update: (
    id: string,
    body: Partial<
      Pick<
        DeliveryAgent,
        "fullName" | "phone" | "vehicleType" | "hubOrZone" | "status"
      >
    >,
  ) => apiClient.patch<DeliveryAgent>(API.deliveryAgents.update(id), body),
  assignShipment: (shipmentId: string, deliveryAgentId: string) =>
    apiClient.post<DeliveryShipment>(
      API.deliveryAgents.assignShipment(shipmentId),
      { deliveryAgentId },
    ),
  assignPickup: (returnId: string, deliveryAgentId: string) =>
    apiClient.post<DeliveryPickup>(API.deliveryAgents.assignPickup(returnId), {
      deliveryAgentId,
    }),
};
