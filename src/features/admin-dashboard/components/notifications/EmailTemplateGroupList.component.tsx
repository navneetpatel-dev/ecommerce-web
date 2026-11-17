import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type { EmailTemplateGroup } from "../../hooks/notifications/useEmailTemplatesPage.hook";
import { emailTemplatesStyles as styles } from "../../styles/notifications/emailTemplates.styles";
import { EmailTemplateItem } from "./EmailTemplateItem.component";

const AUDIENCE_LABEL = {
  customer: LABELS.emailTemplatesAudienceCustomer,
  vendor: LABELS.emailTemplatesAudienceVendor,
  admin: LABELS.emailTemplatesAudienceAdmin,
} as const;

interface EmailTemplateGroupListProps {
  groups: EmailTemplateGroup[];
  selectedType: string | null;
  onSelect: (type: string) => void;
}

/** The catalogue: templates grouped by audience, the selected one highlighted. */
export function EmailTemplateGroupList({
  groups,
  selectedType,
  onSelect,
}: EmailTemplateGroupListProps) {
  return groups.map((group) => (
    <section key={group.key} className={styles.group}>
      <h3 className={styles.groupHeading}>
        {group.group}
        <span className={styles.audienceTag}>
          {AUDIENCE_LABEL[group.audience]}
        </span>
      </h3>
      {group.templates.map((template) => (
        <EmailTemplateItem
          key={template.type}
          template={template}
          className={cn(
            styles.item,
            template.type === selectedType && styles.itemActive,
          )}
          onSelect={onSelect}
        />
      ))}
    </section>
  ));
}
