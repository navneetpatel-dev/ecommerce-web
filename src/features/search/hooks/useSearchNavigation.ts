import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebouncedValue } from '@/shared/hooks/use-debounce'
import { useAutocomplete } from '../api/search.queries'

export function useSearchNavigation() {
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedTerm = useDebouncedValue(term, 200)
  const router = useRouter()
  const { data: suggestions } = useAutocomplete(debouncedTerm, debouncedTerm.length >= 2)

  const handleSelect = (slug: string) => {
    setOpen(false)
    setTerm('')
    router.push(`/products/${slug}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (term.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(term.trim())}`)
    }
  }

  const updateTerm = (value: string) => {
    setTerm(value)
    setOpen(true)
  }

  const openDropdown = () => setOpen(true)
  const closeDropdown = () => setTimeout(() => setOpen(false), 200)

  return { term, open, suggestions, updateTerm, handleSelect, handleSubmit, openDropdown, closeDropdown }
}
