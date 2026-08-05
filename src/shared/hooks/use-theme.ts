'use client'

import { useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = getStoredTheme()
    const initial = stored ?? getSystemTheme()
    setThemeState(initial)
    document.documentElement.setAttribute('data-theme', initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const stored = getStoredTheme()
      if (!stored) {
        const next = e.matches ? 'dark' : 'light'
        setThemeState(next)
        document.documentElement.setAttribute('data-theme', next)
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [mounted])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme, mounted }
}
