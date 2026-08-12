import { Button } from '@/shared/components/ui/button'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { FormFieldFrame } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
import { LABELS } from '@/shared/constants/labels'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface NewsletterFormProps {
  idPrefix: string
  email: string
  message: string | null
  error: string | null
  pending: boolean
  onEmailChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
}

export function NewsletterForm({
  idPrefix,
  email,
  message,
  error,
  pending,
  onEmailChange,
  onSubmit,
}: NewsletterFormProps) {
  const fieldId = `${idPrefix}-newsletter-email`
  const canSubmit = EMAIL_RE.test(email.trim())

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <FormFieldFrame label={LABELS.email} htmlFor={fieldId} error={error ?? undefined}>
        <div className="flex items-stretch gap-2">
          <Input
            id={fieldId}
            type="email"
            placeholder={LABELS.newsletterEmailPlaceholder}
            className="min-w-0 flex-1"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            error={Boolean(error)}
            required
          />
          <DisabledActionHint disabled={!canSubmit} message={LABELS.enterNewsletterEmail}>
            <Button
              type="submit"
              className="shrink-0"
              loading={pending}
              disabled={!canSubmit || pending}
            >
              {LABELS.subscribe}
            </Button>
          </DisabledActionHint>
        </div>
      </FormFieldFrame>
      {message ? <p className="text-[0.8125rem] text-success">{message}</p> : null}
    </form>
  )
}
