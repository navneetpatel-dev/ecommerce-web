import { apiClient } from "@/shared/api/client/client";
import { buildSearchParams } from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { PincodeServiceability } from "@/shared/api/types";

export const serviceabilityKeys = {
  /** The verdict for one delivery area, per vendor — the basket's vendors are part of the key. */
  check: (pincode: string, vendorIds: string[]) =>
    ["shipping", "serviceability", pincode, vendorIds.join(",")] as const,
  all: ["shipping", "serviceability"] as const,
};

export const serviceabilityApi = {
  /**
   * Whether a pincode is delivered to, and which of `vendorIds` do not deliver there.
   * Weight is not part of the question — the quote answers that with the basket's real
   * weight — so this is safe to ask as soon as a pincode is known.
   */
  check: (
    pincode: string,
    options?: { state?: string | null; vendorIds?: string[] },
  ) =>
    apiClient.get<PincodeServiceability>(
      `${API.shipping.serviceability}?${buildSearchParams({
        pincode,
        state: options?.state ?? undefined,
        vendorIds: options?.vendorIds?.length
          ? options.vendorIds.join(",")
          : undefined,
      })}`,
    ),
};
