import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { getFormLevelApiError } from "@/shared/utils/applyApiFormErrors";

interface FormErrorProps {
  error: Error | string | null;
  fallback: string;
}

/** Form-level API or client error — hidden when field-level server errors are shown elsewhere. */
export function FormError({ error, fallback }: FormErrorProps) {
  if (!error) return null;

  const message =
    typeof error === "string"
      ? error
      : getFormLevelApiError(error, fallback) ??
        getApiErrorMessage(error, fallback);

  if (!message) return null;

  return (
    <p role="alert" className="text-body-sm text-danger">
      {message}
    </p>
  );
}
