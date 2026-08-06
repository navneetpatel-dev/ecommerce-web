'use client'

import { useCallback } from 'react'
import { auditApi } from '../api/audit.api'
import { PERMISSIONS } from '@/shared/constants/permissions'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminAuditPage(): AdminListPageModel {
  const load = useCallback(() => auditApi.list(), [])

  return {
    title: 'Audit log',
    permission: PERMISSIONS.AUDIT_VIEW,
    load,
  }
}
