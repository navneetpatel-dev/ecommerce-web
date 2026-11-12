import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { newsletterFormStyles } from "@/shared/styles/display/displayComponents.styles";
import type { ChangeEvent } from "react";

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

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    onEmailChange(event.target.value);
  };

  return (
    // C-08: Subscribe stays enabled; a bad email gets a message on submit instead of
    // a silently disabled button (noValidate keeps the browser bubble out of the way).
    <form onSubmit={onSubmit} noValidate className={newsletterFormStyles.form}>
      <FormFieldFrame
        label={LABELS.email}
        htmlFor={fieldId}
        error={error ?? undefined}
      >
        <div className={newsletterFormStyles.row}>
          <Input
            id={fieldId}
            type="email"
            autoComplete="email"
            placeholder={LABELS.newsletterEmailPlaceholder}
            className={newsletterFormStyles.input}
            value={email}
            onChange={handleEmailChange}
            error={Boolean(error)}
            required
          />
          <Button
            type="submit"
            className={newsletterFormStyles.submitBtn}
            loading={pending}
            disabled={pending}
          >
            {LABELS.subscribe}
          </Button>
        </div>
      </FormFieldFrame>
      {message ? (
        <p role="status" className={newsletterFormStyles.successMessage}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
