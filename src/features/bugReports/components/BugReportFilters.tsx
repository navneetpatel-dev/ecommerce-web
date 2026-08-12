'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormFieldFrame } from '@/shared/components/forms'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import {
  BUG_AFFECTED_MODULE_VALUES,
  BUG_REPORT_SEVERITY_VALUES,
  BUG_REPORT_STATUS_VALUES,
  BUG_REPORTER_ROLE_VALUES,
  type BugAffectedModule,
  type BugReporterRole,
  type BugReportSeverity,
  type BugReportStatus,
} from '@/shared/constants/statuses'
import {
  BUG_MODULE_LABEL,
  BUG_REPORTER_ROLE_LABEL,
  BUG_SEVERITY_LABEL,
  BUG_STATUS_LABEL,
} from '../utils/labels'
import type { BugListParams } from '../api/bugReports.api'

const ALL = 'ALL'

export function useBugFiltersFromUrl(): BugListParams {
  const searchParams = useSearchParams()
  return useMemo(() => {
    const status = searchParams.get('status') as BugReportStatus | null
    const severity = searchParams.get('severity') as BugReportSeverity | null
    const affectedModule = searchParams.get('affectedModule') as BugAffectedModule | null
    const reporterRole = searchParams.get('reporterRole') as BugReporterRole | null
    return {
      status: status && BUG_REPORT_STATUS_VALUES.includes(status) ? status : undefined,
      severity:
        severity && BUG_REPORT_SEVERITY_VALUES.includes(severity) ? severity : undefined,
      affectedModule:
        affectedModule && BUG_AFFECTED_MODULE_VALUES.includes(affectedModule)
          ? affectedModule
          : undefined,
      reporterRole:
        reporterRole && BUG_REPORTER_ROLE_VALUES.includes(reporterRole)
          ? reporterRole
          : undefined,
    }
  }, [searchParams])
}

type BugReportFiltersProps = {
  /** Admin queue shows module + reporter role; reporters only status + severity. */
  variant?: 'admin' | 'reporter'
}

export function BugReportFilters({ variant = 'admin' }: BugReportFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isAdmin = variant === 'admin'

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString())
    if (!value || value === ALL) next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div
      className={`grid gap-3 border border-line bg-surface-raised p-4 sm:grid-cols-2 ${
        isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-2'
      }`}
    >
      <FormFieldFrame label={LABELS.status}>
        <Select
          value={searchParams.get('status') ?? ALL}
          onValueChange={(v) => setParam('status', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{LABELS.ticketFilterAllStatuses}</SelectItem>
            {BUG_REPORT_STATUS_VALUES.map((status) => (
              <SelectItem key={status} value={status}>
                {BUG_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.bugSeverity}>
        <Select
          value={searchParams.get('severity') ?? ALL}
          onValueChange={(v) => setParam('severity', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.bugFilterAllSeverities} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{LABELS.bugFilterAllSeverities}</SelectItem>
            {BUG_REPORT_SEVERITY_VALUES.map((severity) => (
              <SelectItem key={severity} value={severity}>
                {BUG_SEVERITY_LABEL[severity]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      {isAdmin ? (
        <>
          <FormFieldFrame label={LABELS.bugAffectedModule}>
            <Select
              value={searchParams.get('affectedModule') ?? ALL}
              onValueChange={(v) => setParam('affectedModule', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={LABELS.bugFilterAllModules} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{LABELS.bugFilterAllModules}</SelectItem>
                {BUG_AFFECTED_MODULE_VALUES.map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {BUG_MODULE_LABEL[mod]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.bugFilterReporterRole}>
            <Select
              value={searchParams.get('reporterRole') ?? ALL}
              onValueChange={(v) => setParam('reporterRole', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={LABELS.bugFilterAllReporterRoles} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{LABELS.bugFilterAllReporterRoles}</SelectItem>
                {BUG_REPORTER_ROLE_VALUES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {BUG_REPORTER_ROLE_LABEL[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </>
      ) : null}
    </div>
  )
}
