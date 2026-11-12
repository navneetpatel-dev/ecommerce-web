import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { unsubscribeViewStyles as styles } from "../../styles/unsubscribe/unsubscribeView.styles";

interface UnsubscribeViewProps {
  hasToken: boolean;
  isPending: boolean;
  isDone: boolean;
  error: string | null;
  onConfirm: () => void;
}

export function UnsubscribeView({
  hasToken,
  isPending,
  isDone,
  error,
  onConfirm,
}: UnsubscribeViewProps) {
  const heading = isDone
    ? LABELS.unsubscribeDoneHeading
    : LABELS.unsubscribeHeading;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{heading}</h1>
        {isDone ? (
          <p className={styles.body} role="status">
            {LABELS.unsubscribeDoneBody}
          </p>
        ) : hasToken ? (
          <>
            <p className={styles.body}>{LABELS.unsubscribeBody}</p>
            <FormError error={error} fallback={LABELS.unsubscribeFailed} />
            <Button type="button" loading={isPending} onClick={onConfirm}>
              {LABELS.unsubscribeConfirm}
            </Button>
          </>
        ) : (
          <p className={styles.body} role="alert">
            {LABELS.unsubscribeInvalid}
          </p>
        )}
        <Link href={PATHS.profile} className={styles.link}>
          {LABELS.unsubscribeGoToProfile}
        </Link>
      </div>
    </div>
  );
}
