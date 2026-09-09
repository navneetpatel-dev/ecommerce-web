import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { oauthEntryPoint } from "@/shared/config/appConfig";
import { authFormsStyles } from "../../styles/shell/authForms.styles";

export function OAuthButton({
  provider,
  redirect,
}: {
  provider: string;
  redirect?: string | null;
}) {
  const label =
    provider === "google"
      ? LABELS.continueWithGoogle
      : LABELS.continueWithGoogle;

  return (
    <Button variant="outline" fullWidth asChild>
      <a href={oauthEntryPoint(provider, redirect)}>
        {provider === "google" ? (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={authFormsStyles.googleIcon}
          >
            <path
              fill="#EA4335"
              d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
            />
            <path
              fill="#34A853"
              d="M6.6 14.3l-.5.4-2.1 1.6C5.5 19.1 8.5 21 12 21c2.3 0 4.2-.8 5.6-2.1l-3.1-2.4c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8z"
            />
            <path
              fill="#4A90E2"
              d="M4 7.7C3.4 8.9 3 10.4 3 12s.4 3.1 1 4.3c0 .1 2.6-2 2.6-2-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L4 7.7z"
            />
            <path
              fill="#FBBC05"
              d="M12 5.1c1.3 0 2.4.4 3.3 1.3l2.5-2.5C16.2 2.5 14.3 1.8 12 1.8 8.5 1.8 5.5 3.7 4 6.7l2.6 2c.7-2.2 2.7-3.6 5.4-3.6z"
            />
          </svg>
        ) : null}
        {label}
      </a>
    </Button>
  );
}
