"use client";

import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { EmailHealthBanner } from "../../components/notifications/EmailHealthBanner.component";
import { EmailTemplateGroupList } from "../../components/notifications/EmailTemplateGroupList.component";
import { EmailTemplatePreview } from "../../components/notifications/EmailTemplatePreview.component";
import { useEmailTemplatesPage } from "../../hooks/notifications/useEmailTemplatesPage.hook";
import { emailTemplatesStyles as styles } from "../../styles/notifications/emailTemplates.styles";
import { adminPagesStyles } from "../shared/adminPages.styles";

export function AdminEmailTemplatesPage() {
  const page = useEmailTemplatesPage();

  return (
    <RequirePermission permission={PERMISSIONS.SETTINGS_MANAGE}>
      <div className={adminPagesStyles.stack5}>
        <div>
          <h1 className={adminPagesStyles.pageHeadingLgNormal}>
            {LABELS.emailTemplatesTitle}
          </h1>
          <p className={adminPagesStyles.hintMuted}>
            {LABELS.emailTemplatesHint}
          </p>
        </div>
        <EmailHealthBanner />
        {page.loadError ? (
          <p role="alert" className={adminPagesStyles.errorSmText}>
            {page.loadError}
          </p>
        ) : null}
        <div className={styles.layout}>
          <nav
            className={styles.catalogue}
            aria-label={LABELS.emailTemplatesTitle}
          >
            <EmailTemplateGroupList
              groups={page.groups}
              selectedType={page.selectedType}
              onSelect={page.handleSelect}
            />
          </nav>
          {page.selectedType ? (
            <EmailTemplatePreview
              subject={page.previewSubject}
              html={page.previewHtml}
              theme={page.theme}
              isLoading={page.isPreviewLoading}
              error={page.previewError}
              notice={page.notice}
              testError={page.testError}
              isSendingTest={page.isSendingTest}
              onLight={page.handleLight}
              onDark={page.handleDark}
              onSendTest={page.handleSendTest}
            />
          ) : (
            <p className={styles.empty}>{LABELS.emailTemplatesSelectPrompt}</p>
          )}
        </div>
      </div>
    </RequirePermission>
  );
}
