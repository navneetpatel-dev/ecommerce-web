import { cn } from '@/shared/utils/cn'

/** Shared soft action chip styles for admin tables (light + dark). */
export const adminActionTone = {
  edit: cn(
    'border-brand/30 bg-brand-subtle/60 text-ink shadow-sm',
    'hover:border-brand hover:bg-brand hover:text-paper',
    'gap-1.5 px-3 font-medium tracking-wide',
    '[&_svg]:!size-3.5 [&_svg]:shrink-0',
  ),
  archive: cn(
    'border-warning/35 bg-warning-subtle text-warning shadow-sm',
    'hover:border-warning hover:bg-warning hover:text-paper',
    'gap-1.5 px-3 font-medium tracking-wide',
    '[&_svg]:!size-3.5 [&_svg]:shrink-0',
  ),
  danger: cn(
    'border-danger/35 bg-danger-subtle text-danger shadow-sm',
    'hover:border-danger hover:bg-danger hover:text-paper',
    'gap-1.5 px-3 font-medium tracking-wide',
    '[&_svg]:!size-3.5 [&_svg]:shrink-0',
  ),
  success: cn(
    'border-brand/40 bg-brand-subtle text-brand shadow-sm',
    'hover:border-brand hover:bg-brand hover:text-paper',
    'gap-1.5 px-3 font-medium tracking-wide',
    '[&_svg]:!size-3.5 [&_svg]:shrink-0',
  ),
  neutral: cn(
    'border-line bg-surface text-ink shadow-sm',
    'hover:border-line-strong hover:bg-paper',
    'gap-1.5 px-3 font-medium tracking-wide',
    '[&_svg]:!size-3.5 [&_svg]:shrink-0',
  ),
} as const

export type AdminActionTone = keyof typeof adminActionTone
