import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  DeliveryAgent,
  DeliveryAgentRatings,
  DeliveryPickup,
  DeliveryShipment,
  ShiftSummary,
} from "../../types/agent/types";
import {
  updateCachedDeliveryStatus,
  updateCachedPickupStatus,
} from "../../offline/offline/deliveryOfflineCache";
import {
  enqueueStatusUpdate,
  isOffline,
} from "../../offline/offline/deliveryOfflineQueue";
import {
  deliveryAgentPayoutsApi,
  deliveryAdminPayoutsApi,
} from "../earnings/deliveryAgentPayouts.api";
import {
  deliveryAgentDocumentsApi,
  deliveryAdminDocumentsApi,
} from "../documents/deliveryAgentDocuments.api";
import { deliveryAdminDispatchApi } from "./deliveryAgentDispatch.api";
import { statusQuery, withOfflineCache } from "../offline/deliveryAgentOfflineFetch";

const deliveryAgentCoreApi = {
  profile: () => apiClient.get<DeliveryAgent>(API.deliveryAgents.meProfile),
  myRatings: () =>
    apiClient.get<DeliveryAgentRatings>(API.deliveryAgents.meRatings),
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
    withOfflineCache(`pickup:${returnId}`, () =>
      apiClient.get<DeliveryPickup>(API.deliveryAgents.mePickup(returnId)),
    ),
  updateLocation: (lat: number, lng: number) =>
    apiClient.patch<{ lat: number; lng: number; updatedAt: string }>(
      API.deliveryAgents.meLocation,
      { lat, lng },
    ),
  shiftSummary: () =>
    apiClient.get<ShiftSummary>(API.deliveryAgents.meShiftSummary),
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
  requestPickupCode: (returnId: string) =>
    apiClient.post<{ sent: boolean; expiresInMinutes: number }>(
      API.deliveryAgents.mePickupRequestCode(returnId),
    ),
  updateDeliveryStatus: async (
    shipmentId: string,
    body: { status: string; note?: string; photoUrl?: string },
    options?: { bypassOfflineQueue?: boolean },
  ) => {
    if (!options?.bypassOfflineQueue && isOffline()) {
      await updateCachedDeliveryStatus(shipmentId, body.status, body.note);
      await enqueueStatusUpdate({
        kind: "delivery",
        shipmentId,
        status: body.status,
        note: body.note,
      });
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
  updatePickupStatus: async (
    returnId: string,
    note: string,
    options?: { bypassOfflineQueue?: boolean },
  ) => {
    if (!options?.bypassOfflineQueue && isOffline()) {
      await updateCachedPickupStatus(returnId, note);
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

export const deliveryAgentApi = {
  ...deliveryAgentCoreApi,
  ...deliveryAgentPayoutsApi,
  ...deliveryAgentDocumentsApi,
};

const deliveryAdminCoreApi = {
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
};

export const deliveryAdminApi = {
  ...deliveryAdminCoreApi,
  ...deliveryAdminDispatchApi,
  ...deliveryAdminPayoutsApi,
  ...deliveryAdminDocumentsApi,
};
