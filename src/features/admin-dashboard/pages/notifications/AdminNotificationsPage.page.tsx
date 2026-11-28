"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Megaphone, RotateCcw, Send } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { BroadcastHistoryTab } from "../../components/notifications/BroadcastHistoryTab.component";
import { BroadcastNotificationDialog } from "../../components/notifications/BroadcastNotificationDialog.component";
import { BulkRetryConfirmDialog } from "../../components/notifications/BulkRetryConfirmDialog.component";
import { SendTestConfirmDialog } from "../../components/notifications/SendTestConfirmDialog.component";
import { SuppressedEmailsTab } from "../../components/notifications/SuppressedEmailsTab.component";
import type { AdminBroadcastRecord } from "../../api/notifications/notifications.api";
import { EmailHealthBanner } from "../../components/notifications/EmailHealthBanner.component";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { Button } from "@/shared/components/ui/button";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { NotificationLogsTab } from "../../components/notifications/NotificationLogsTab.component";
import {
  NotificationTabStrip,
  type NotificationTab,
} from "../../components/notifications/NotificationTabStrip.component";
import { useAdminNotificationsPage } from "../../hooks/notifications/useAdminNotificationsPage.hook";

export function AdminNotificationsPage() {
  const { filters, setFilters, loadLogs } = useAdminNotificationsPage();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [sendTestOpen, setSendTestOpen] = useState(false);
  const [bulkRetryOpen, setBulkRetryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("logs");
  const [duplicateRecord, setDuplicateRecord] =
    useState<AdminBroadcastRecord | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [pageNotice, setPageNotice] = useState<string | null>(null);

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
          <Button variant="outline" onClick={() => setSendTestOpen(true)}>
            <Send className={adminPagesStyles.iconSm} aria-hidden="true" />
            Send test
          </Button>
          <Button onClick={() => setBroadcastOpen(true)}>
            <Megaphone className={adminPagesStyles.iconSm} aria-hidden="true" />
            {notificationsAdminLabels.broadcastTitle}
          </Button>
        </div>
      </div>

      {pageNotice ? (
        <p role="status" className={adminPagesStyles.successSmText}>
          {pageNotice}
        </p>
      ) : null}

      <EmailHealthBanner
        onFilterCategory={(category) => {
          setActiveTab("logs");
          setFilters((prev) => ({
            ...prev,
            status: "FAILED",
            errorCategory: category,
          }));
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line">
        <NotificationTabStrip activeTab={activeTab} onSelect={setActiveTab} />

        {activeTab === "logs" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setBulkRetryOpen(true)}
            className="mb-1.5"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Retry failed & stuck
          </Button>
        )}
      </div>

      {activeTab === "logs" ? (
        <NotificationLogsTab
          filters={filters}
          setFilters={setFilters}
          loadLogs={loadLogs}
        />
      ) : activeTab === "broadcasts" ? (
        <BroadcastHistoryTab
          refreshSignal={historyRefresh}
          onDuplicate={(record) => {
            setDuplicateRecord(record);
            setBroadcastOpen(true);
          }}
          onViewLogs={(broadcastId) => {
            setActiveTab("logs");
            setFilters({ referenceId: broadcastId });
          }}
        />
      ) : (
        <SuppressedEmailsTab />
      )}

      <BroadcastNotificationDialog
        open={broadcastOpen}
        onOpenChange={(open) => {
          setBroadcastOpen(open);
          if (!open) setDuplicateRecord(null);
        }}
        duplicateRecord={duplicateRecord}
        onSuccess={() => setHistoryRefresh((n) => n + 1)}
      />

      <SendTestConfirmDialog
        open={sendTestOpen}
        onOpenChange={setSendTestOpen}
        onSuccess={(msg) => setPageNotice(msg)}
      />

      <BulkRetryConfirmDialog
        open={bulkRetryOpen}
        onOpenChange={setBulkRetryOpen}
        filters={filters}
        onSuccess={(summary) => {
          setPageNotice(summary);
          setFilters((prev) => ({ ...prev }));
        }}
      />
    </div>
  );
}
