import { LABELS } from '@/shared/constants/labels'

export function OAuthDivider() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-line" />
      </div>
      <div className="relative flex justify-center text-[0.75rem] font-medium uppercase tracking-[0.08em]">
        <span className="bg-surface px-3 text-ink-faint">{LABELS.orContinueWith}</span>
      </div>
    </div>
  )
}
