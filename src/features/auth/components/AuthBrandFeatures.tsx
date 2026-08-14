import { Shield, Sparkles, Truck } from 'lucide-react'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

const FEATURES = [
  {
    icon: Sparkles,
    title: LABELS.authFeatureCurated,
    hint: LABELS.authFeatureCuratedHint,
  },
  {
    icon: Shield,
    title: LABELS.authFeatureSecure,
    hint: LABELS.authFeatureSecureHint,
  },
  {
    icon: Truck,
    title: LABELS.authFeatureDelivery,
    hint: LABELS.authFeatureDeliveryHint,
  },
] as const

interface AuthBrandFeaturesProps {
  variant?: 'list' | 'pills'
  className?: string
}

/** Trust highlights for auth marketing surfaces. */
export function AuthBrandFeatures({ variant = 'list', className }: AuthBrandFeaturesProps) {
  if (variant === 'pills') {
    return (
      <ul className={cn('flex flex-wrap justify-center gap-2 sm:gap-2.5', className)}>
        {FEATURES.map(({ icon: Icon, title }) => (
          <li
            key={title}
            className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/55 px-3 py-1.5 text-[0.75rem] font-medium text-ink-muted shadow-elevation-1 backdrop-blur-sm sm:px-3.5 sm:text-[0.8125rem]"
          >
            <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} />
            {title}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul
      className={cn(
        'divide-y divide-line/55 overflow-hidden rounded-xl bg-surface/35 shadow-elevation-1 backdrop-blur-sm',
        className,
      )}
    >
      {FEATURES.map(({ icon: Icon, title, hint }) => (
        <li key={title} className="flex items-start gap-3 px-4 py-3.5 sm:px-4 sm:py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-subtle/35 ring-1 ring-line/50">
            <Icon aria-hidden className="h-4 w-4 text-brand" strokeWidth={1.75} />
          </span>
          <span className="min-w-0">
            <span className="block text-[0.9375rem] font-medium text-ink">{title}</span>
            <span className="mt-0.5 block text-[0.8125rem] leading-relaxed text-ink-muted">{hint}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
