"use client";

import { Send } from "lucide-react";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { NotificationLogFiltersBar } from "../../components/notifications/NotificationLogFiltersBar.component";
import { BroadcastNotificationForm } from "../../components/notifications/BroadcastNotificationForm.component";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { Button } from "@/shared/components/ui/button";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { useAdminNotificationsPage } from "../../hooks/notifications/useAdminNotificationsPage.hook";

export function AdminNotificationsPage() {
  const { pending, message, error, filters, setFilters, loadLogs, sendTest } =
    useAdminNotificationsPage();

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
        <Button loading={pending} onClick={() => void sendTest()}>
          <Send className={adminPagesStyles.iconSm} aria-hidden="true" />
          Send test
        </Button>
      </div>
      {message ? (
        <p className={adminPagesStyles.successSmText}>{message}</p>
      ) : null}
      {error ? <p className={adminPagesStyles.errorSmText}>{error}</p> : null}

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
          "sentAt",
          "createdAt",
        ]}
      />
    </div>
  );
}
