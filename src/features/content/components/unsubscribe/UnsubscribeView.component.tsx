import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { unsubscribeViewStyles as styles } from "../../styles/unsubscribe/unsubscribeView.styles";

export interface UnsubscribeCopy {
  heading: string;
  body: string;
  confirm: string;
  doneHeading: string;
  doneBody: string;
  invalid: string;
  failed: string;
  linkLabel: string;
  linkHref: string;
}

const MARKETING_COPY: UnsubscribeCopy = {
  heading: LABELS.unsubscribeHeading,
  body: LABELS.unsubscribeBody,
  confirm: LABELS.unsubscribeConfirm,
  doneHeading: LABELS.unsubscribeDoneHeading,
  doneBody: LABELS.unsubscribeDoneBody,
  invalid: LABELS.unsubscribeInvalid,
  failed: LABELS.unsubscribeFailed,
  linkLabel: LABELS.unsubscribeGoToProfile,
  linkHref: PATHS.profile,
};

interface UnsubscribeViewProps {
  hasToken: boolean;
  isPending: boolean;
  isDone: boolean;
  error: string | null;
  onConfirm: () => void;
  /** Other emailed "stop this" links reuse the page with their own wording and way out. */
  copy?: UnsubscribeCopy;
}

export function UnsubscribeView({
  hasToken,
  isPending,
  isDone,
  error,
  onConfirm,
  copy = MARKETING_COPY,
}: UnsubscribeViewProps) {
  const heading = isDone ? copy.doneHeading : copy.heading;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        {isDone ? (
          <p className={styles.body} role="status">
            {copy.doneBody}
          </p>
        ) : hasToken ? (
          <>
            <p className={styles.body}>{copy.body}</p>
            <FormError error={error} fallback={copy.failed} />
            <Button type="button" loading={isPending} onClick={onConfirm}>
              {copy.confirm}
            </Button>
          </>
        ) : (
          <p className={styles.body} role="alert">
            {copy.invalid}
          </p>
        )}
        <Link href={copy.linkHref} className={styles.link}>
          {copy.linkLabel}
        </Link>
      </div>
    </div>
  );
}
