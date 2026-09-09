import { FormError } from "@/shared/components/FormError.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

interface QueryErrorAlertProps {
  error: unknown;
  fallback: string;
}

/** Standard query/load failure banner using sanitized API messages. */
export function QueryErrorAlert({ error, fallback }: QueryErrorAlertProps) {
  if (!error) return null;
  const message = getApiErrorMessage(error, fallback);
  return <FormError error={message} fallback={fallback} />;
}
