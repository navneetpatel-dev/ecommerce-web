import { useQuery } from '@tanstack/react-query'
import { searchApi } from './search.api'
import {
  SEARCH_AUTOCOMPLETE_MIN_CHARS,
  SEARCH_AUTOCOMPLETE_STALE_MS,
} from '../constants'

export const searchKeys = {
  all: ['search'] as const,
  autocomplete: (term: string) => [...searchKeys.all, 'autocomplete', term] as const,
}

export function useAutocomplete(term: string, enabled: boolean) {
  const trimmed = term.trim()
  const canFetch = enabled && trimmed.length >= SEARCH_AUTOCOMPLETE_MIN_CHARS

  return useQuery({
    queryKey: searchKeys.autocomplete(trimmed),
    queryFn: () => searchApi.autocomplete(trimmed),
    enabled: canFetch,
    staleTime: SEARCH_AUTOCOMPLETE_STALE_MS,
    placeholderData: (prev) => prev,
  })
}
