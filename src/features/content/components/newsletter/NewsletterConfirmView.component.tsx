import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { newsletterConfirmViewStyles as styles } from "../../styles/newsletter/newsletterConfirmView.styles";

interface NewsletterConfirmViewProps {
  hasToken: boolean;
  isPending: boolean;
  isDone: boolean;
  error: string | null;
  onConfirm: () => void;
}

export function NewsletterConfirmView({
  hasToken,
  isPending,
  isDone,
  error,
  onConfirm,
}: NewsletterConfirmViewProps) {
  const heading = isDone
    ? LABELS.newsletterConfirmedHeading
    : LABELS.newsletterConfirmHeading;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        {isDone ? (
          <p className={styles.body} role="status">
            {LABELS.newsletterConfirmedBody}
          </p>
        ) : hasToken ? (
          <>
            <p className={styles.body}>{LABELS.newsletterConfirmBody}</p>
            <FormError
              error={error}
              fallback={LABELS.newsletterConfirmFailed}
            />
            <Button type="button" loading={isPending} onClick={onConfirm}>
              {LABELS.newsletterConfirmButton}
            </Button>
          </>
        ) : (
          <p className={styles.body} role="alert">
            {LABELS.newsletterConfirmInvalid}
          </p>
        )}
        <Link href={PATHS.home} className={styles.link}>
          {LABELS.newsletterBackToStore}
        </Link>
      </div>
    </div>
  );
}
