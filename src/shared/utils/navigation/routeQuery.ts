/** Merge query updates into a pathname, removing keys set to null/undefined/empty. */
export function replaceRouteQuery(
  pathname: string,
  searchParams: URLSearchParams,
  updates: Record<string, string | null | undefined>,
): string {
  const next = new URLSearchParams(searchParams.toString())

  for (const [key, value] of Object.entries(updates)) {
    if (value == null || value === '') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
  }

  const qs = next.toString()
  return qs ? `${pathname}?${qs}` : pathname
}
