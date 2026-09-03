import { apiClient } from "@/shared/api/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  DeliveryAgent,
  DeliveryPickup,
  DeliveryShipment,
  UnassignedShipment,
} from "../types";

function statusQuery(statuses?: string[]): string {
  return statuses?.length
    ? `?status=${encodeURIComponent(statuses.join(","))}`
    : "";
}

export const deliveryAgentApi = {
  profile: () => apiClient.get<DeliveryAgent>(API.deliveryAgents.meProfile),
  myDeliveries: (statuses?: string[]) =>
    apiClient.get<DeliveryShipment[]>(
      `${API.deliveryAgents.meDeliveries}${statusQuery(statuses)}`,
    ),
  myPickups: (statuses?: string[]) =>
    apiClient.get<DeliveryPickup[]>(
      `${API.deliveryAgents.mePickups}${statusQuery(statuses)}`,
    ),
  requestPickupCode: (returnId: string) =>
    apiClient.post<{ sent: boolean; expiresInMinutes: number }>(
      API.deliveryAgents.mePickupRequestCode(returnId),
    ),
  updateDeliveryStatus: (
    shipmentId: string,
    body: { status: string; note?: string },
  ) =>
    apiClient.patch<DeliveryShipment>(
      API.deliveryAgents.meDeliveryStatus(shipmentId),
      body,
    ),
  requestDeliveryCode: (shipmentId: string) =>
    apiClient.post<{ sent: boolean; expiresInMinutes: number }>(
      API.deliveryAgents.meDeliveryRequestCode(shipmentId),
    ),
  confirmDelivery: (
    shipmentId: string,
    body: { otpCode: string; proofPhotoUrl?: string },
  ) =>
    apiClient.post<DeliveryShipment>(
      API.deliveryAgents.meDeliveryConfirm(shipmentId),
      body,
    ),
  updatePickupStatus: (returnId: string, note: string) =>
    apiClient.patch<DeliveryPickup>(
      API.deliveryAgents.mePickupStatus(returnId),
      { status: "FAILED", note },
    ),
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
