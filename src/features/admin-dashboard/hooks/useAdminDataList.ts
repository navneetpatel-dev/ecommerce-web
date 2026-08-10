'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  isPaginatedList,
  type PaginatedList,
} from '@/shared/api/pagination'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import { LABELS } from '@/shared/constants/labels'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { useClientPagination } from '@/shared/hooks/useClientPagination'
import { shouldInferAdminColumn } from '../utils/adminTableCells'

export type AdminDataRow = Record<string, unknown>

export type AdminListLoadFn = (params: { page: number; limit: number }) => Promise<unknown>

function normalizeResult(data: unknown): PaginatedList<AdminDataRow> | AdminDataRow[] {
  if (Array.isArray(data)) return data as AdminDataRow[]
  if (isPaginatedList<AdminDataRow>(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
    const value = data as { items: AdminDataRow[]; total?: number; totalPages?: number; page?: number; limit?: number }
    return {
      items: value.items,
      total: value.total ?? value.items.length,
      page: value.page ?? 1,
      limit: value.limit ?? (value.items.length || 1),
      totalPages: value.totalPages ?? 1,
    }
  }
  return []
}

export function useAdminDataList(load: AdminListLoadFn, pageSize = DEFAULT_PAGE_LIMIT) {
  const [mode, setMode] = useState<'server' | 'client'>('server')
  const [serverRows, setServerRows] = useState<AdminDataRow[]>([])
  const [clientRows, setClientRows] = useState<AdminDataRow[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const client = useClientPagination(clientRows, pageSize)

  const fetchPage = useCallback(
    (nextPage: number) => {
      setLoading(true)
      setError(null)
      load({ page: nextPage, limit: pageSize })
        .then((raw) => {
          const data = normalizeResult(raw)
          if (Array.isArray(data)) {
            setMode('client')
            setClientRows(data)
            setPage(1)
            setTotal(data.length)
            setTotalPages(Math.max(1, Math.ceil(data.length / pageSize)))
            return
          }
          setMode('server')
          const resolvedPage = data.page || nextPage
          const resolvedTotalPages = Math.max(1, data.totalPages)
          // Inflated totals can leave empty deep pages — clamp to last real page.
          if (data.items.length === 0 && data.total > 0 && resolvedPage > resolvedTotalPages) {
            fetchPage(resolvedTotalPages)
            return
          }
          setServerRows(data.items)
          setPage(resolvedPage)
          setTotal(data.total)
          setTotalPages(resolvedTotalPages)
        })
        .catch((err) => setError(getApiErrorMessage(err, LABELS.couldNotLoadData)))
        .finally(() => setLoading(false))
    },
    [load, pageSize],
  )

  useEffect(() => {
    fetchPage(1)
  }, [fetchPage])

  const onPageChange = useCallback(
    (nextPage: number) => {
      if (mode === 'client') {
        client.onPageChange(nextPage)
        return
      }
      setPage(nextPage)
      fetchPage(nextPage)
    },
    [mode, client, fetchPage],
  )

  const reload = useCallback(() => {
    if (mode === 'client') {
      fetchPage(1)
      return
    }
    fetchPage(page)
  }, [mode, fetchPage, page])

  const rows = mode === 'client' ? client.pageRows : serverRows
  const currentPage = mode === 'client' ? client.page : page
  const pages = mode === 'client' ? client.totalPages : totalPages
  const resultTotal = mode === 'client' ? client.total : total
  const from =
    mode === 'client'
      ? client.from
      : resultTotal === 0 || rows.length === 0
        ? 0
        : (currentPage - 1) * pageSize + 1
  const to =
    mode === 'client'
      ? client.to
      : rows.length === 0
        ? 0
        : Math.min((currentPage - 1) * pageSize + rows.length, resultTotal)

  return useMemo(
    () => ({
      rows,
      loading,
      error,
      reload,
      page: currentPage,
      totalPages: pages,
      total: resultTotal,
      from,
      to,
      onPageChange,
      mode,
    }),
    [rows, loading, error, reload, currentPage, pages, resultTotal, from, to, onPageChange, mode],
  )
}

/** Infer readable columns from the first row (skips IDs and bulky nested payloads). */
export function inferAdminColumns(rows: AdminDataRow[], max = 5): string[] {
  if (!rows[0]) return []
  return Object.keys(rows[0])
    .filter((key) => shouldInferAdminColumn(key))
    .slice(0, max)
}
