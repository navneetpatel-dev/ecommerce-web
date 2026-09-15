import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type {
  ExportJobSummary,
  ExportJobListItem,
  StartExportInput,
} from "@/shared/types/exports.types";

export const exportJobsApi = {
  start: (input: StartExportInput) =>
    apiClient.post<{ jobId: string; status: string }>(
      API.exports.create,
      input,
    ),
  status: (jobId: string) =>
    apiClient.get<ExportJobSummary>(API.exports.status(jobId)),
  downloadUrl: (jobId: string) =>
    apiClient.get<{ url: string }>(API.exports.download(jobId)),
  list: () => apiClient.get<ExportJobListItem[]>(API.exports.list),
  cancel: (jobId: string) =>
    apiClient.delete<{ cancelled: boolean }>(API.exports.cancel(jobId)),
  acknowledge: (jobId: string) =>
    apiClient.post<{ acknowledged: boolean }>(API.exports.acknowledge(jobId)),
};
