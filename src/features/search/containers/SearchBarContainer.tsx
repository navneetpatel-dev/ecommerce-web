'use client'

import { useSearchNavigation } from '../hooks/useSearchNavigation'
import { SearchBar } from '../components/SearchBar'

interface SearchBarContainerProps {
  size?: 'lg' | 'sm'
  className?: string
  onDark?: boolean
  /** e.g. close the mobile search sheet after navigating to results */
  onAfterSubmit?: () => void
}

export function SearchBarContainer({
  size,
  className,
  onDark,
  onAfterSubmit,
}: SearchBarContainerProps) {
  const search = useSearchNavigation(onAfterSubmit)

  return (
    <SearchBar
      size={size}
      className={className}
      onDark={onDark}
      term={search.term}
      open={search.open}
      suggestions={search.suggestions}
      isFetching={search.isFetching}
      onTermChange={search.updateTerm}
      onFocus={search.openDropdown}
      onBlur={search.closeDropdown}
      onSubmit={search.handleSubmit}
      onSelect={search.handleSelect}
    />
  )
}
