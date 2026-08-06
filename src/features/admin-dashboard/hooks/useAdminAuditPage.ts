'use client'

import { useCallback } from 'react'
import { auditApi } from '../api/audit.api'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminAuditPage(): AdminListPageModel {
  const load = useCallback(async () => auditApi.list(), [])

  return {
    title: LABELS.audit,
    permission: PERMISSIONS.AUDIT_VIEW,
    load,
  }
}
