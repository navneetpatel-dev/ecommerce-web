'use client'

import { useSearchNavigation } from '../hooks/useSearchNavigation'
import { SearchBar } from '../components/SearchBar'

interface SearchBarContainerProps {
  size?: 'lg' | 'sm'
  className?: string
  onDark?: boolean
}

export function SearchBarContainer({ size, className, onDark }: SearchBarContainerProps) {
  const search = useSearchNavigation()

  return (
    <SearchBar
      size={size}
      className={className}
      onDark={onDark}
      term={search.term}
      open={search.open}
      suggestions={search.suggestions}
      onTermChange={search.updateTerm}
      onFocus={search.openDropdown}
      onBlur={search.closeDropdown}
      onSubmit={search.handleSubmit}
      onSelect={search.handleSelect}
    />
  )
}
