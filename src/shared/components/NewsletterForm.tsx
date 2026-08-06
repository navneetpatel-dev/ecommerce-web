import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

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
  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label htmlFor={`${idPrefix}-newsletter-email`} className="mb-2 block text-[0.8125rem] font-medium text-ink">
        Email
      </label>
      <div className="flex items-center gap-2">
        <Input
          id={`${idPrefix}-newsletter-email`}
          type="email"
          placeholder="Your email"
          className="min-w-0 flex-1 text-[0.9375rem]"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
        <Button type="submit" className="h-11 shrink-0" loading={pending}>
          Subscribe
        </Button>
      </div>
      {error && <p className="text-[0.8125rem] text-danger">{error}</p>}
      {message && <p className="text-[0.8125rem] text-success">{message}</p>}
    </form>
  )
}
