'use client'

import { useEffect, useState } from 'react'

export function useShare(url: string, title: string) {
  const [copied, setCopied] = useState(false)
  const [resolvedUrl, setResolvedUrl] = useState(url)

  useEffect(() => {
    if (url.startsWith('http')) {
      setResolvedUrl(url)
      return
    }
    if (typeof window !== 'undefined') {
      setResolvedUrl(new URL(url, window.location.origin).toString())
    }
  }, [url])

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title, url: resolvedUrl })
      return true
    }
    return false
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(resolvedUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return {
    copied,
    resolvedUrl,
    shareNative,
    copyLink,
  }
}
