import { Share2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/components/ui/popover'

interface ShareButtonProps {
  copied: boolean
  onShareNative: () => void
  onCopyLink: () => void
  label?: string
}

export function ShareButton({
  copied,
  onShareNative,
  onCopyLink,
  label = 'Share this product',
}: ShareButtonProps) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="shrink-0 md:hidden"
        onClick={onShareNative}
        aria-label="Share"
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
            aria-label="Share"
          >
            <Share2 size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <h3 className="text-[0.9375rem] font-medium text-ink">{label}</h3>
            <button
              type="button"
              onClick={onCopyLink}
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
