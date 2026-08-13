import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebouncedValue } from '@/shared/hooks/use-debounce'
import { useAutocomplete } from '../api/search.queries'
import { navigate } from '@/shared/utils/navigate'
import { PATHS } from '@/shared/constants/paths'
import {
  SEARCH_AUTOCOMPLETE_DEBOUNCE_MS,
  SEARCH_AUTOCOMPLETE_MIN_CHARS,
} from '../constants'
import { suggestionHref } from '../utils/suggestionHref'
import type { SearchSuggestion } from '../types'

export function useSearchNavigation(onAfterSubmit?: () => void) {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedTerm = useDebouncedValue(term, SEARCH_AUTOCOMPLETE_DEBOUNCE_MS)
  const router = useRouter()
  const trimmedDebounced = debouncedTerm.trim()
  const canSuggest = trimmedDebounced.length >= SEARCH_AUTOCOMPLETE_MIN_CHARS
  const { data: suggestions = [], isFetching, isFetched } = useAutocomplete(
    debouncedTerm,
    open && canSuggest,
  )

  useEffect(() => {
    setActiveIndex(-1)
  }, [trimmedDebounced, suggestions])

  const closeDropdown = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
  }, [])

  const handleSelect = useCallback(
    (suggestion: SearchSuggestion) => {
      closeDropdown()
      setTerm('')
      navigate(router, suggestionHref(suggestion))
    },
    [closeDropdown, router],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = term.trim()
      if (!trimmed) return

      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelect(suggestions[activeIndex])
        onAfterSubmit?.()
        return
      }

      closeDropdown()
      navigate(router, `${PATHS.products}?search=${encodeURIComponent(trimmed)}`)
      setTerm('')
      onAfterSubmit?.()
    },
    [activeIndex, closeDropdown, handleSelect, onAfterSubmit, router, suggestions, term],
  )

  const updateTerm = useCallback((value: string) => {
    setTerm(value)
    setOpen(true)
  }, [])

  const openDropdown = useCallback(() => setOpen(true), [])

  const scheduleCloseDropdown = useCallback(() => {
    window.setTimeout(() => closeDropdown(), 200)
  }, [closeDropdown])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || !canSuggest) {
        if (event.key === 'Escape') closeDropdown()
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!suggestions.length) return
        setActiveIndex((index) => (index + 1) % suggestions.length)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (!suggestions.length) return
        setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        closeDropdown()
        return
      }

      if (event.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
        event.preventDefault()
        handleSelect(suggestions[activeIndex])
      }
    },
    [activeIndex, canSuggest, closeDropdown, handleSelect, open, suggestions],
  )

  const showPanel =
    open &&
    canSuggest &&
    (isFetching || suggestions.length > 0 || (isFetched && !isFetching))

  return {
    term,
    open,
    suggestions,
    activeIndex,
    inputRef,
    showPanel,
    isFetching: canSuggest && isFetching,
    updateTerm,
    handleSelect,
    handleSubmit,
    handleKeyDown,
    openDropdown,
    closeDropdown: scheduleCloseDropdown,
  }
}
