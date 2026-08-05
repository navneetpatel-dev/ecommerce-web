'use client'

import { useEffect, useState } from 'react'

export interface CookiePreferences {
  necessary: true
  analytics: boolean
  marketing: boolean
}

const CONSENT_KEY = 'cookie-consent'
const PREFERENCES_KEY = 'cookie-preferences'

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
}

function readStoredPreferences(): CookiePreferences {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY)
    if (!raw) return defaultPreferences
    const parsed = JSON.parse(raw) as Partial<CookiePreferences>
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return defaultPreferences
  }
}

export function useCookieBanner() {
  const [visible, setVisible] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    setPreferences(readStoredPreferences())
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const persistConsent = (next: CookiePreferences, status: 'accepted' | 'custom') => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next))
    localStorage.setItem(CONSENT_KEY, status)
    setPreferences(next)
    setPreferencesOpen(false)
    setVisible(false)
  }

  const acceptAll = () => {
    persistConsent(
      { necessary: true, analytics: true, marketing: true },
      'accepted'
    )
  }

  const savePreferences = () => {
    persistConsent(preferences, 'custom')
  }

  const dismiss = () => setVisible(false)

  const openPreferences = () => {
    setPreferences(readStoredPreferences())
    setPreferencesOpen(true)
  }

  const closePreferences = () => setPreferencesOpen(false)

  const setAnalytics = (value: boolean) => {
    setPreferences((current) => ({ ...current, analytics: value }))
  }

  const setMarketing = (value: boolean) => {
    setPreferences((current) => ({ ...current, marketing: value }))
  }

  return {
    visible,
    preferencesOpen,
    preferences,
    acceptAll,
    savePreferences,
    dismiss,
    openPreferences,
    closePreferences,
    setAnalytics,
    setMarketing,
  }
}
