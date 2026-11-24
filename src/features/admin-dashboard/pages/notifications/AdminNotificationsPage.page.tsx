"use client";

import Link from "next/link";
import { Mail, Send } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { NotificationLogFiltersBar } from "../../components/notifications/NotificationLogFiltersBar.component";
import { BroadcastNotificationForm } from "../../components/notifications/BroadcastNotificationForm.component";
import { EmailHealthBanner } from "../../components/notifications/EmailHealthBanner.component";
import { NotificationLogRowActions } from "../../components/notifications/NotificationLogRowActions.component";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { Button } from "@/shared/components/ui/button";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { useAdminNotificationsPage } from "../../hooks/notifications/useAdminNotificationsPage.hook";

export function AdminNotificationsPage() {
  const { pending, message, error, filters, setFilters, loadLogs, sendTest } =
    useAdminNotificationsPage();

  const renderRowActions = (row: AdminDataRow, reload: () => void) => (
    <NotificationLogRowActions
      id={String(row.id)}
      status={String(row.status)}
      reload={reload}
    />
  );

  const handleSendTest = () => {
    void sendTest();
  };

  return (
    <div className={adminPagesStyles.stack5}>
      <div className={adminPagesStyles.headerRow}>
        <div>
          <h1 className={adminPagesStyles.pageHeadingLgNormal}>
            Notification delivery
          </h1>
          <p className={adminPagesStyles.hintMuted}>
            Recent transactional delivery attempts across email and browser
            push.
          </p>
        </div>
        <div className={adminPagesStyles.headerActions}>
          <Button asChild variant="outline">
            <Link href={PATHS.admin.emailTemplates}>
              <Mail className={adminPagesStyles.iconSm} aria-hidden="true" />
              {LABELS.emailTemplatesOpen}
            </Link>
          </Button>
          <Button loading={pending} onClick={handleSendTest}>
            <Send className={adminPagesStyles.iconSm} aria-hidden="true" />
            Send test
          </Button>
        </div>
      </div>
      {message ? (
        <p className={adminPagesStyles.successSmText}>{message}</p>
      ) : null}
      {error ? (
        <p role="alert" className={adminPagesStyles.errorSmText}>
          {error}
        </p>
      ) : null}

      <EmailHealthBanner />

      <BroadcastNotificationForm />

      <div>
        <h2 className={adminPagesStyles.subheadingMedium}>
          {notificationsAdminLabels.notificationLogFilters}
        </h2>
        <NotificationLogFiltersBar filters={filters} onChange={setFilters} />
      </div>

      <AdminDataPage
        title="Notification logs"
        hideTitle
        permission={PERMISSIONS.SETTINGS_MANAGE}
        load={loadLogs}
        columnKeys={[
          "type",
          "channel",
          "recipient",
          "status",
          "errorCategory",
          "error",
          "sentAt",
          "createdAt",
        ]}
        actions={renderRowActions}
        fetchRowDetail={async (row) =>
          row as unknown as Record<string, unknown>
        }
      />
    </div>
  );
}
