import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { queryErrorAlertStyles as styles } from "../../styles/notices/queryErrorAlert.styles";

interface QueryErrorAlertProps {
  error: unknown;
  fallback: string;
  /** When provided, renders a Retry button that re-runs the failed query. */
  onRetry?: () => void;
}

/** Standard query/load failure banner using sanitized API messages. */
export function QueryErrorAlert({
  error,
  fallback,
  onRetry,
}: QueryErrorAlertProps) {
  if (!error) return null;
  const message = getApiErrorMessage(error, fallback);
  return (
    <div className={styles.root}>
      <FormError error={message} fallback={fallback} />
      {onRetry ? (
        <Button type="button" size="sm" variant="outline" onClick={onRetry}>
          {LABELS.retry}
        </Button>
      ) : null}
    </div>
  );
}
