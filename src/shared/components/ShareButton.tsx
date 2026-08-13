import { Share2, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/shared/components/ui/popover'
import { LABELS } from '@/shared/constants/labels'

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
  label = LABELS.shareThisProduct,
}: ShareButtonProps) {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 w-11 shrink-0 rounded-full border-line px-0 md:hidden"
        onClick={onShareNative}
        aria-label={copied ? LABELS.linkCopied : LABELS.share}
      >
        <Share2 size={18} />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="hidden h-11 w-11 shrink-0 rounded-full border-line px-0 md:inline-flex"
            aria-label={LABELS.share}
          >
            <Share2 size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-3">
            <h3 className="text-[0.9375rem] font-medium text-ink">{label}</h3>
            <Button
              type="button"
              variant="outline"
              onClick={onCopyLink}
              className="w-full justify-start gap-2 font-normal"
            >
              <LinkIcon className="h-4 w-4" />
              {copied ? LABELS.linkCopied : LABELS.copyLink}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
