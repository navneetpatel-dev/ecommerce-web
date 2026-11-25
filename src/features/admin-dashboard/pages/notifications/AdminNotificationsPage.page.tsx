"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Megaphone, Send } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { NotificationLogFiltersBar } from "../../components/notifications/NotificationLogFiltersBar.component";
import { BroadcastHistoryTab } from "../../components/notifications/BroadcastHistoryTab.component";
import { BroadcastNotificationDialog } from "../../components/notifications/BroadcastNotificationDialog.component";
import type { AdminBroadcastRecord } from "../../api/notifications/notifications.api";
import { EmailHealthBanner } from "../../components/notifications/EmailHealthBanner.component";
import { NotificationLogRowActions } from "../../components/notifications/NotificationLogRowActions.component";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { useAdminNotificationsPage } from "../../hooks/notifications/useAdminNotificationsPage.hook";

function emailTemplateHref(type: unknown, channel: unknown): string | null {
  if (channel !== "EMAIL" || typeof type !== "string" || !type.trim()) {
    return null;
  }
  return `${PATHS.admin.emailTemplates}?type=${encodeURIComponent(type)}`;
}

export function AdminNotificationsPage() {
  const { pending, message, error, filters, setFilters, loadLogs, sendTest } =
    useAdminNotificationsPage();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"logs" | "broadcasts">("logs");
  const [duplicateRecord, setDuplicateRecord] =
    useState<AdminBroadcastRecord | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

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
          <Button variant="outline" loading={pending} onClick={handleSendTest}>
            <Send className={adminPagesStyles.iconSm} aria-hidden="true" />
            Send test
          </Button>
          <Button onClick={() => setBroadcastOpen(true)}>
            <Megaphone className={adminPagesStyles.iconSm} aria-hidden="true" />
            {notificationsAdminLabels.broadcastTitle}
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

      <div className="flex items-center gap-1 border-b border-line">
        {(
          [
            { id: "logs", label: "Delivery logs" },
            { id: "broadcasts", label: "Broadcast history" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-body-sm font-medium border-b-2 transition-colors cursor-pointer",
              activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "logs" ? (
        <>
          <NotificationLogFiltersBar filters={filters} onChange={setFilters} />

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
            cellOverrides={{
              type: (row) => {
                const href = emailTemplateHref(row.type, row.channel);
                const label = String(row.type ?? "—");
                if (!href) return label;
                return (
                  <Link
                    href={href}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 font-mono text-body-xs text-brand hover:underline"
                    title="View email template"
                  >
                    <span>{label}</span>
                    <ArrowUpRight
                      className="size-3 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                );
              },
            }}
            detailFieldLinks={{
              type: (val, rec) => emailTemplateHref(val, rec.channel),
            }}
            actions={renderRowActions}
            fetchRowDetail={async (row) =>
              row as unknown as Record<string, unknown>
            }
          />
        </>
      ) : (
        <BroadcastHistoryTab
          refreshSignal={historyRefresh}
          onDuplicate={(record) => {
            setDuplicateRecord(record);
            setBroadcastOpen(true);
          }}
        />
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
    </div>
  );
}
