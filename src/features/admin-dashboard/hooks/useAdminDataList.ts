'use client'

import { useCallback, useEffect, useState } from 'react'

export type AdminDataRow = Record<string, unknown>

export function useAdminDataList(load: () => Promise<unknown>) {
  const [rows, setRows] = useState<AdminDataRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    load()
      .then((data) => {
        const value = data as { items?: AdminDataRow[] } | AdminDataRow[]
        setRows(Array.isArray(value) ? value : value.items ?? [])
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load data'))
      .finally(() => setLoading(false))
  }, [load])

  useEffect(() => {
    reload()
  }, [reload])

  return { rows, loading, error, reload }
}
