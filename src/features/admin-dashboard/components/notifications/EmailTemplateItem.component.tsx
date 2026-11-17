import { LABELS } from "@/shared/constants/labels";
import type { EmailTemplateSummary } from "../../api/notifications/notifications.api";
import { emailTemplatesStyles as styles } from "../../styles/notifications/emailTemplates.styles";

interface EmailTemplateItemProps {
  template: EmailTemplateSummary;
  className: string;
  onSelect: (type: string) => void;
}

export function EmailTemplateItem({
  template,
  className,
  onSelect,
}: EmailTemplateItemProps) {
  const handleClick = () => onSelect(template.type);

  return (
    <button type="button" className={className} onClick={handleClick}>
      <span className={styles.itemSubject}>{template.subject}</span>
      <span className={styles.itemType}>{template.type}</span>
      {template.marketing ? (
        <span className={styles.marketingTag}>
          {LABELS.emailTemplatesMarketing}
        </span>
      ) : null}
    </button>
  );
}
