import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebouncedValue } from '@/shared/hooks/use-debounce'
import { useAutocomplete } from '../api/search.queries'
import { navigate } from '@/shared/utils/navigate'

export function useSearchNavigation() {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedTerm = useDebouncedValue(term, 200)
  const router = useRouter()
  const { data: suggestions, isFetching } = useAutocomplete(debouncedTerm, debouncedTerm.length >= 2)

  const handleSelect = (slug: string) => {
    setOpen(false)
    setTerm('')
    navigate(router, `/products/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim()) {
      setOpen(false)
      navigate(router, `/products?search=${encodeURIComponent(term.trim())}`)
      setTerm('')
    }
  }

  const updateTerm = (value: string) => {
    setTerm(value)
    setOpen(true)
  }

  const openDropdown = () => setOpen(true)
  const closeDropdown = () => setTimeout(() => setOpen(false), 200)

  return {
    term,
    open,
    suggestions,
    isFetching: debouncedTerm.length >= 2 && isFetching,
    updateTerm,
    handleSelect,
    handleSubmit,
    openDropdown,
    closeDropdown,
  }
}
