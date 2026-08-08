'use client'

import { useEffect, useMemo, useState } from 'react'
import { LABELS } from '@/shared/constants/labels'
import {
  reportsEngineApi,
  type ReportCatalogItem,
  type ReportRunResult,
} from '../api/reportsEngine.api'

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

function labelForKey(key: string): string {
  const map = LABELS as Record<string, string>
  return map[key] ?? key
}

async function pollExportUntilReady(exportId: string) {
  const maxAttempts = 40
  for (let i = 0; i < maxAttempts; i += 1) {
    const status = await reportsEngineApi.exportStatus(exportId)
    if (status.status === 'READY' || status.status === 'SYNC') {
      await reportsEngineApi.downloadExport(exportId)
      return 'ready' as const
    }
    if (status.status === 'FAILED') {
      return 'failed' as const
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  return 'pending' as const
}

export function useReportHub(options?: { preferAudience?: string }) {
  const [catalog, setCatalog] = useState<ReportCatalogItem[]>([])
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [reportType, setReportType] = useState<string>('')
  const [from, setFrom] = useState(defaultRange().from)
  const [to, setTo] = useState(defaultRange().to)
  const [vendorId, setVendorId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<ReportRunResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    reportsEngineApi
      .catalog()
      .then((items) => {
        const filtered = options?.preferAudience
          ? items.filter((i) => i.audience.startsWith(options.preferAudience!))
          : items
        setCatalog(filtered.length ? filtered : items)
        if ((filtered.length ? filtered : items)[0]) {
          setReportType((filtered.length ? filtered : items)[0]!.type)
        }
      })
      .catch(() => setCatalogError(LABELS.reportCatalogError))
  }, [options?.preferAudience])

  // Resume download if navigated with ?exportId=
  useEffect(() => {
    if (typeof window === 'undefined') return
    const exportId = new URLSearchParams(window.location.search).get('exportId')
    if (!exportId) return
    setMessage(LABELS.reportAsyncQueued)
    void pollExportUntilReady(exportId).then((outcome) => {
      if (outcome === 'ready') setMessage(LABELS.reportAsyncReady)
      else if (outcome === 'failed') setError(LABELS.reportAsyncFailed)
      else setMessage(LABELS.reportAsyncQueued)
    })
  }, [])

  const selected = useMemo(
    () => catalog.find((c) => c.type === reportType) ?? null,
    [catalog, reportType],
  )

  const load = (nextPage = page) => {
    if (!reportType) return
    setLoading(true)
    setError(null)
    setMessage(null)
    reportsEngineApi
      .run(reportType, {
        from,
        to,
        page: nextPage,
        limit: 50,
        vendorId: vendorId || undefined,
        categoryId: categoryId || undefined,
        status: status || undefined,
      })
      .then((data) => {
        setResult(data)
        setPage(nextPage)
      })
      .catch(() => setError(LABELS.reportLoadError))
      .finally(() => setLoading(false))
  }

  const exportExcel = () => {
    if (!reportType) return
    setExporting(true)
    setMessage(null)
    setError(null)
    reportsEngineApi
      .exportExcel(reportType, {
        from,
        to,
        vendorId: vendorId || undefined,
        categoryId: categoryId || undefined,
        status: status || undefined,
      })
      .then(async (maybeAsync) => {
        if (maybeAsync && typeof maybeAsync === 'object' && 'async' in maybeAsync && maybeAsync.async) {
          const exportId = String((maybeAsync as { exportId: string }).exportId)
          setMessage(LABELS.reportAsyncQueued)
          const outcome = await pollExportUntilReady(exportId)
          if (outcome === 'ready') setMessage(LABELS.reportAsyncReady)
          else if (outcome === 'failed') setError(LABELS.reportAsyncFailed)
          else setMessage(LABELS.reportAsyncQueued)
        }
      })
      .catch(() => setError(LABELS.reportLoadError))
      .finally(() => setExporting(false))
  }

  return {
    catalog,
    catalogError,
    reportType,
    setReportType: (type: string) => {
      setReportType(type)
      setResult(null)
      setPage(1)
    },
    selected,
    labelForKey,
    from,
    setFrom,
    to,
    setTo,
    vendorId,
    setVendorId,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    page,
    result,
    loading,
    error,
    message,
    exporting,
    load,
    exportExcel,
    setPage: (p: number) => load(p),
  }
}
