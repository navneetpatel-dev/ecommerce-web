import { apiClient } from '@/shared/api/client/client'
import { API } from '@/shared/constants/apiRoutes'
import {
  fetchCursorPage,
  type CursorPage,
} from '@/shared/api/client/cursorPagination'
import { buildSearchParams } from '@/shared/api/client/pagination'
import type {
  BugAffectedModule,
  BugAttachmentType,
  BugReporterRole,
  BugReportSeverity,
  BugReportStatus,
} from '@/shared/constants/statuses'

export type BugAttachment = {
  id?: string
  url: string
  type: BugAttachmentType
  durationSeconds?: number | null
  createdAt?: string
}

export type BugAttachmentInput = {
  url: string
  type: BugAttachmentType
  durationSeconds?: number | null
}

export type BugComment = {
  id: string
  bugReportId: string
  authorId: string
  authorName: string | null
  body: string
  createdAt: string
}

export type BugTimelineEntry = {
  action: string
  createdAt: string
  status: string | null
  from: string | null
  to: string | null
  automated: boolean
  duplicateOfReportNumber: string | null
}

export type BugReport = {
  id: string
  reportNumber: string
  reporterId: string
  reporterName: string | null
  reporterRole: BugReporterRole
  title: string
  description: string
  stepsToReproduce: string | null
  severity: BugReportSeverity | null
  status: BugReportStatus
  duplicateOfId: string | null
  duplicateOfReportNumber?: string | null
  assignedToId: string | null
  assignedToName: string | null
  affectedModule: BugAffectedModule
  pageUrl: string | null
  userAgent: string | null
  browserName: string | null
  osName: string | null
  deviceType: string | null
  appVersion: string | null
  userId: string
  userRole: string
  occurredAt: string
  triagedAt: string | null
  inProgressAt?: string | null
  resolvedAt: string | null
  verifiedAt?: string | null
  wontFixReason: string | null
  createdAt: string
  updatedAt: string
  attachments?: BugAttachment[]
  comments?: BugComment[]
  timeline?: BugTimelineEntry[]
}

export type CreateBugReportBody = {
  title: string
  description: string
  stepsToReproduce?: string | null
  attachmentUrls?: BugAttachmentInput[]
}

export type { CursorPage }

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  return buildSearchParams(params).toString()
}

export type BugListParams = {
  limit?: number
  cursor?: string | null
  status?: BugReportStatus
  severity?: BugReportSeverity
  affectedModule?: BugAffectedModule
  reporterRole?: BugReporterRole
}

export const bugReportsApi = {
  create: (body: CreateBugReportBody, pageUrl?: string | null) =>
    apiClient.post<BugReport>(
      API.bugReports.root,
      body,
      pageUrl
        ? { headers: { 'X-Page-Url': pageUrl } }
        : undefined,
    ),

  listMine: (params: BugListParams = {}) =>
    fetchCursorPage<BugReport>(
      API.bugReports.mine(
        buildQuery({
          limit: params.limit,
          cursor: params.cursor,
          status: params.status,
          severity: params.severity,
        }),
      ),
    ),

  listAdmin: (params: BugListParams = {}) =>
    fetchCursorPage<BugReport>(
      API.bugReports.admin(
        buildQuery({
          limit: params.limit,
          cursor: params.cursor,
          status: params.status,
          severity: params.severity,
          affectedModule: params.affectedModule,
          reporterRole: params.reporterRole,
        }),
      ),
    ),

  getById: (id: string) => apiClient.get<BugReport>(API.bugReports.detail(id)),

  triage: (
    id: string,
    body: {
      severity: BugReportSeverity
      affectedModule: BugAffectedModule
      assignedToId?: string | null
    },
  ) => apiClient.post<BugReport>(API.bugReports.triage(id), body),

  updateAssignment: (
    id: string,
    body: {
      severity: BugReportSeverity
      affectedModule: BugAffectedModule
      assignedToId?: string | null
    },
  ) => apiClient.post<BugReport>(API.bugReports.assignment(id), body),

  updateStatus: (id: string, status: BugReportStatus) =>
    apiClient.post<BugReport>(API.bugReports.status(id), { status }),

  markDuplicate: (id: string, duplicateOf: string) =>
    apiClient.post<BugReport>(API.bugReports.duplicate(id), { duplicateOf }),

  wontFix: (id: string, reason: string) =>
    apiClient.post<BugReport>(API.bugReports.wontFix(id), { reason }),

  verify: (id: string) => apiClient.post<BugReport>(API.bugReports.verify(id)),

  listComments: (id: string, params: { limit?: number; cursor?: string | null } = {}) =>
    fetchCursorPage<BugComment>(
      API.bugReports.comments(id, buildQuery({ limit: params.limit, cursor: params.cursor })),
    ),

  addComment: (id: string, body: string) =>
    apiClient.post<BugComment>(API.bugReports.comments(id), { body }),
}
