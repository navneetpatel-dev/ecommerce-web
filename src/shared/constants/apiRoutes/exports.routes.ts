export const exportsRoutes = {
  create: "/api/exports",
  list: "/api/exports",
  status: (jobId: string) => `/api/exports/${jobId}`,
  download: (jobId: string) => `/api/exports/${jobId}/download`,
  cancel: (jobId: string) => `/api/exports/${jobId}`,
  acknowledge: (jobId: string) => `/api/exports/${jobId}/ack`,
} as const;
