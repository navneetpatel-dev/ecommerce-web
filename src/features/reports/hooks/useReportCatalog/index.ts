'use client'

import { useEffect, useMemo, useState } from 'react'
import { LABELS } from '@/shared/constants/labels'
import { reportsEngineApi, type ReportCatalogItem } from '../../api/reportsEngine.api'

export function useReportCatalog(options?: { preferAudience?: string }) {
  const [catalog, setCatalog] = useState<ReportCatalogItem[]>([])
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [reportType, setReportTypeState] = useState<string>('')

  useEffect(() => {
    reportsEngineApi
      .catalog()
      .then((items) => {
        const filtered = options?.preferAudience
          ? items.filter((i) => i.audience.startsWith(options.preferAudience!))
          : items
        setCatalog(filtered.length ? filtered : items)
        if ((filtered.length ? filtered : items)[0]) {
          setReportTypeState((filtered.length ? filtered : items)[0]!.type)
        }
      })
      .catch(() => setCatalogError(LABELS.reportCatalogError))
  }, [options?.preferAudience])

  const selected = useMemo(
    () => catalog.find((c) => c.type === reportType) ?? null,
    [catalog, reportType],
  )

  return { catalog, catalogError, reportType, setReportTypeState, selected }
}
