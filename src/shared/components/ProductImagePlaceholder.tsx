import { cn } from '@/shared/utils/cn'

interface ProductImagePlaceholderProps {
  className?: string
  /** Icon size in pixels — keep small relative to the media frame. */
  iconSize?: number
  label?: string
}

/** Default “image not available” graphic for product media. */
export function ProductImagePlaceholder({
  className,
  iconSize = 40,
  label = 'Image not available',
}: ProductImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center',
        'bg-brand-subtle/80 text-ink-faint',
        className
      )}
      role="img"
      aria-label={label}
    >
      <div className="flex h-[28%] w-[28%] max-h-14 max-w-14 min-h-9 min-w-9 items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="h-full w-full text-ink-faint opacity-80"
        >
          <rect
            x="2.75"
            y="2.75"
            width="18.5"
            height="18.5"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.35"
          />
          <circle
            cx="15.25"
            cy="8.5"
            r="1.65"
            stroke="currentColor"
            strokeWidth="1.35"
          />
          <path
            d="M4.25 17.25 9.1 12.2a1.1 1.1 0 0 1 1.55 0l2.35 2.4 3.2-3.85a1.1 1.1 0 0 1 1.7 0l2.85 3.5"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
