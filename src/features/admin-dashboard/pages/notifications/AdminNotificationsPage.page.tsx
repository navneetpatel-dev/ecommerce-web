"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Megaphone,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { AdminDataPage } from "../shared/AdminDataPage.page";
import { NotificationLogFiltersBar } from "../../components/notifications/NotificationLogFiltersBar.component";
import { BroadcastHistoryTab } from "../../components/notifications/BroadcastHistoryTab.component";
import { BroadcastNotificationDialog } from "../../components/notifications/BroadcastNotificationDialog.component";
import { SuppressedEmailsTab } from "../../components/notifications/SuppressedEmailsTab.component";
import {
  notificationsApi,
  type AdminBroadcastRecord,
} from "../../api/notifications/notifications.api";
import { EmailHealthBanner } from "../../components/notifications/EmailHealthBanner.component";
import { NotificationLogRowActions } from "../../components/notifications/NotificationLogRowActions.component";
import type { AdminDataRow } from "../../hooks/shared/useAdminDataList.hook";
import { notificationsAdminLabels } from "@/shared/constants/labels/notificationsAdmin";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
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
  const [activeTab, setActiveTab] = useState<
    "logs" | "broadcasts" | "suppressions"
  >("logs");
  const [duplicateRecord, setDuplicateRecord] =
    useState<AdminBroadcastRecord | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkNotice, setBulkNotice] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const renderRowActions = (row: AdminDataRow, reload: () => void) => (
    <NotificationLogRowActions
      id={String(row.id)}
      status={String(row.status)}
      createdAt={typeof row.createdAt === "string" ? row.createdAt : undefined}
      reload={reload}
    />
  );

  const handleBulkRetry = async () => {
    setBulkBusy(true);
    setBulkNotice(null);
    setBulkError(null);
    try {
      const res = await notificationsApi.bulkResend({
        referenceId: filters.referenceId,
        type: filters.type,
        errorCategory: filters.errorCategory,
        includeStuckPending: true,
      });
      setBulkNotice(
        res.attempted === 0
          ? "No failed or stuck emails matched the current filters."
          : `Requeued ${res.requeued} of ${res.attempted} failed/stuck emails.`,
      );
      setFilters((prev) => ({ ...prev }));
    } catch (err) {
      setBulkError(
        getApiErrorMessage(err, "Unable to bulk-retry failed emails."),
      );
    } finally {
      setBulkBusy(false);
    }
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
          <Button
            variant="outline"
            loading={pending}
            onClick={() => void sendTest()}
          >
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
        <div className="flex items-center gap-1">
          {(
            [
              { id: "logs", label: "Delivery logs" },
              { id: "broadcasts", label: "Broadcast history" },
              { id: "suppressions", label: "Suppressed addresses" },
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

        {activeTab === "logs" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            loading={bulkBusy}
            onClick={handleBulkRetry}
            className="mb-1.5"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Retry failed & stuck
          </Button>
        )}
      </div>

      {bulkNotice ? (
        <p role="status" className={adminPagesStyles.successSmText}>
          {bulkNotice}
        </p>
      ) : null}
      {bulkError ? (
        <p role="alert" className={adminPagesStyles.errorSmText}>
          {bulkError}
        </p>
      ) : null}

      {activeTab === "logs" ? (
        <>
          <div className="space-y-2">
            {filters.referenceId && (
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-caption text-brand">
                <span className="font-mono">
                  Broadcast: {filters.referenceId.slice(0, 8)}…
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, referenceId: undefined }))
                  }
                  aria-label="Clear broadcast filter"
                  className="hover:opacity-75 cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            <NotificationLogFiltersBar
              filters={filters}
              onChange={setFilters}
            />
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
              "attempts",
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
    </div>
  );
}
