import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { getFormLevelApiError } from "@/shared/utils/api-errors/applyApiFormErrors";

import { formErrorStyles } from "../../styles/forms/formError.styles";

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
      : (getFormLevelApiError(error, fallback) ??
        getApiErrorMessage(error, fallback));

  if (!message) return null;

  return (
    <p role="alert" className={formErrorStyles.message}>
      {message}
    </p>
  );
}
