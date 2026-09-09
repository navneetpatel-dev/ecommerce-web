export type ApiListResponse<T> = {
  data: T[]
  meta?: Record<string, unknown>
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Canonical FE shape for paginated list endpoints (`data[]` + `meta.pagination`). */
export type PaginatedList<T> = {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PaginationQuery = {
  page?: number
  limit?: number
}

function asPaginationMeta(value: unknown): Partial<PaginationMeta> | undefined {
  if (!value || typeof value !== 'object') return undefined
  return value as Partial<PaginationMeta>
}

/** Unwrap `getWithResponse` list payloads into a stable PaginatedList. */
export function unwrapPaginatedList<T>(res: ApiListResponse<T>): PaginatedList<T> {
  const items = Array.isArray(res.data) ? res.data : []
  const pagination = asPaginationMeta(res.meta?.pagination)
  const total = pagination?.total ?? items.length
  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? (items.length || 1)
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(total / limit))

  return { items, total, page, limit, totalPages }
}

/** Treat a plain array as a single-page list (client pagination source). */
export function asClientPaginatedList<T>(items: T[], page = 1, limit = items.length || 1): PaginatedList<T> {
  return {
    items,
    total: items.length,
    page,
    limit,
    totalPages: 1,
  }
}

export function isPaginatedList<T>(value: unknown): value is PaginatedList<T> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      Array.isArray((value as PaginatedList<T>).items) &&
      typeof (value as PaginatedList<T>).total === 'number',
  )
}
