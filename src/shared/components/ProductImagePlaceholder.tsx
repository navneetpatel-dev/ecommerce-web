import { cn } from '@/shared/utils/cn'

export type ProductImagePlaceholderFit = 'contain' | 'cover'

interface ProductImagePlaceholderProps {
  className?: string
  label?: string
  fit?: ProductImagePlaceholderFit
}

/** Default “image not available” graphic — fills the media frame like object-fit. */
export function ProductImagePlaceholder({
  className,
  label = 'Image not available',
  fit = 'contain',
}: ProductImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden bg-paper text-ink-faint',
        className,
      )}
      role="img"
      aria-label={label}
      data-image-state="unavailable"
      title={label}
    >
      <svg
        className="h-full w-full"
        preserveAspectRatio={fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet'}
        viewBox="0 0 1200 900"
        aria-hidden
      >
        <rect width="1200" height="900" fill="currentColor" fillOpacity="0.06" />
        <rect
          x="56"
          y="56"
          width="1088"
          height="788"
          rx="28"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="3"
          strokeDasharray="18 14"
        />
        <g transform="translate(600 450)" opacity="0.55">
          <rect
            x="-88"
            y="-88"
            width="176"
            height="176"
            rx="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <circle
            cx="28"
            cy="-28"
            r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M-58 46 18-18a10 10 0 0 1 14 0l28 28 46-56a10 10 0 0 1 15 0l57 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}
