/** Shared URL query keys for route-synced dialogs and panels. */
export const QUERY_PARAMS = {
  create: 'create',
  edit: 'edit',
  images: 'images',
  analytics: 'analytics',
} as const

/** Truthy flag value for boolean query params (e.g. ?create=1). */
export const QUERY_FLAG = '1' as const
