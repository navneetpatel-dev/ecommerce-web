import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";

export type WebVitalSummaryRow = {
  name: string;
  path: string;
  p75: number;
  sampleCount: number;
};

export interface WebVitalsSummaryQuery {
  from?: string;
  to?: string;
  path?: string;
}

export const webVitalsAdminApi = {
  summary: (query: WebVitalsSummaryQuery = {}) => {
    const params = new URLSearchParams();
    if (query.from) params.set("from", query.from);
    if (query.to) params.set("to", query.to);
    if (query.path) params.set("path", query.path);
    const qs = params.toString();
    return apiClient.get<WebVitalSummaryRow[]>(
      `${API.webVitals.summary}${qs ? `?${qs}` : ""}`,
    );
  },
};
