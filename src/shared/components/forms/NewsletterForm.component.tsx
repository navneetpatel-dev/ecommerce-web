import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { newsletterFormStyles } from "@/shared/components/display/displayComponents.styles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterFormProps {
  idPrefix: string;
  email: string;
  message: string | null;
  error: string | null;
  pending: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
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
  const fieldId = `${idPrefix}-newsletter-email`;
  const canSubmit = EMAIL_RE.test(email.trim());

  return (
    <form onSubmit={onSubmit} className={newsletterFormStyles.form}>
      <FormFieldFrame
        label={LABELS.email}
        htmlFor={fieldId}
        error={error ?? undefined}
      >
        <div className={newsletterFormStyles.row}>
          <Input
            id={fieldId}
            type="email"
            placeholder={LABELS.newsletterEmailPlaceholder}
            className={newsletterFormStyles.input}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            error={Boolean(error)}
            required
          />
          <DisabledActionHint
            disabled={!canSubmit}
            message={LABELS.enterNewsletterEmail}
          >
            <Button
              type="submit"
              className={newsletterFormStyles.submitBtn}
              loading={pending}
              disabled={!canSubmit || pending}
            >
              {LABELS.subscribe}
            </Button>
          </DisabledActionHint>
        </div>
      </FormFieldFrame>
      {message ? (
        <p className={newsletterFormStyles.successMessage}>{message}</p>
      ) : null}
    </form>
  );
}
