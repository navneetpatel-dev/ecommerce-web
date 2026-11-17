import { Moon, Send, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { emailTemplatesStyles as styles } from "../../styles/notifications/emailTemplates.styles";

interface EmailTemplatePreviewProps {
  subject: string | null;
  html: string | null;
  theme: "light" | "dark";
  isLoading: boolean;
  error: string | null;
  notice: string | null;
  testError: string | null;
  isSendingTest: boolean;
  onLight: () => void;
  onDark: () => void;
  onSendTest: () => void;
}

/** One template rendered with sample data, with the light/dark switch and the test-send button. */
export function EmailTemplatePreview({
  subject,
  html,
  theme,
  isLoading,
  error,
  notice,
  testError,
  isSendingTest,
  onLight,
  onDark,
  onSendTest,
}: EmailTemplatePreviewProps) {
  return (
    <div className={styles.previewPanel}>
      <div className={styles.toolbar}>
        <p className={styles.toolbarTitle}>
          {LABELS.emailTemplatesSubject}:{" "}
          <span className={styles.toolbarSubject}>{subject}</span>
        </p>
        <div className={styles.toolbarActions}>
          <Button
            type="button"
            size="sm"
            variant={theme === "light" ? "secondary" : "outline"}
            onClick={onLight}
          >
            <Sun aria-hidden="true" />
            {LABELS.emailTemplatesLight}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={theme === "dark" ? "secondary" : "outline"}
            onClick={onDark}
          >
            <Moon aria-hidden="true" />
            {LABELS.emailTemplatesDark}
          </Button>
          <Button
            type="button"
            size="sm"
            loading={isSendingTest}
            onClick={onSendTest}
          >
            <Send aria-hidden="true" />
            {LABELS.emailTemplatesSendTest}
          </Button>
        </div>
      </div>
      {notice ? (
        <p role="status" className={styles.empty}>
          {notice}
        </p>
      ) : null}
      <FormError error={testError} fallback={LABELS.emailTemplatesTestFailed} />
      {error ? (
        <p role="alert" className={styles.empty}>
          {error}
        </p>
      ) : isLoading && !html ? (
        <p className={styles.loading}>…</p>
      ) : html ? (
        <iframe
          title={LABELS.emailTemplatesPreviewTitle}
          className={styles.frame}
          sandbox=""
          srcDoc={html}
        />
      ) : null}
    </div>
  );
}
