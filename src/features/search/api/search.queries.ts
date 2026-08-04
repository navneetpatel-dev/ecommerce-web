import { useQuery } from '@tanstack/react-query'
import { searchApi } from './search.api'

export function useAutocomplete(term: string, enabled: boolean) {
  return useQuery({
    queryKey: ['search', 'autocomplete', term],
    queryFn: () => searchApi.autocomplete(term),
    enabled,
  })
}
