import { PATHS } from '@/shared/constants/paths'
import { SEARCH_SUGGESTION_TYPE } from '../constants'
import type { SearchSuggestion } from '../types'

export function suggestionHref(suggestion: SearchSuggestion): string {
  switch (suggestion.type) {
    case SEARCH_SUGGESTION_TYPE.VENDOR:
      return PATHS.vendorPage(suggestion.slug)
    case SEARCH_SUGGESTION_TYPE.CATEGORY: {
      const slugs = (suggestion.path || suggestion.slug)
        .split('/')
        .map((part) => part.trim())
        .filter(Boolean)
      return slugs.length ? PATHS.category(...slugs) : PATHS.categories
    }
    case SEARCH_SUGGESTION_TYPE.PRODUCT:
    default:
      return PATHS.product(suggestion.slug)
  }
}
