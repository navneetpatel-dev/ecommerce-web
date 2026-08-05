'use client'

import { Share2, Link as LinkIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/components/ui/popover'

interface ShareButtonProps {
  url: string
  title: string
}

export function ShareButton({ url, title }: ShareButtonProps) {
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

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title, url: resolvedUrl })
      return true
    }
    return false
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resolvedUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="shrink-0 md:hidden"
        onClick={() => void handleNativeShare()}
        aria-label="Share product"
      >
        <Share2 size={20} />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="hidden md:inline-flex shrink-0"
            aria-label="Share product"
          >
            <Share2 size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <h3 className="text-[0.9375rem] font-medium text-ink">Share this product</h3>
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex w-full items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-left text-[0.9375rem] text-ink hover:bg-paper"
            >
              <LinkIcon className="h-4 w-4" />
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
