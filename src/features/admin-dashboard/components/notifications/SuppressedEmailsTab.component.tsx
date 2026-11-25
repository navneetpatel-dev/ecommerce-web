"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import {
  notificationsApi,
  type EmailSuppressionRow,
} from "../../api/notifications/notifications.api";

export function SuppressedEmailsTab() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<EmailSuppressionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationsApi.listSuppressions(q, 1, 50);
      setRows(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Unable to load suppressed email addresses."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(search), 250);
    return () => clearTimeout(t);
  }, [search, load]);

  const handleUnsuppress = async (email: string) => {
    setBusyEmail(email);
    setError(null);
    setNotice(null);
    try {
      await notificationsApi.clearSuppression(email);
      setNotice(`Unsuppressed ${email}. Future emails can now be delivered.`);
      await load(search);
    } catch (err) {
      setError(getApiErrorMessage(err, `Failed to unsuppress ${email}.`));
    } finally {
      setBusyEmail(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search suppressed email..."
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-caption text-ink-muted">
            {total} suppressed {total === 1 ? "address" : "addresses"}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void load(search)}
          >
            <RefreshCw className="size-3.5" aria-hidden />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-body-sm text-danger"
        >
          {error}
        </div>
      ) : null}

      {notice ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-body-sm text-emerald-700 dark:text-emerald-400"
        >
          {notice}
        </div>
      ) : null}

      {loading ? (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          Loading suppressed addresses…
        </p>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          No suppressed email addresses found.
        </p>
      ) : (
        <div className="divide-y divide-line/60 rounded-xl border border-line bg-surface">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
            >
              <div className="space-y-1 min-w-0">
                <p className="font-mono text-body-sm font-medium text-ink truncate">
                  {row.email}
                </p>
                <p className="text-caption text-ink-muted">{row.reason}</p>
                <p className="text-[11px] text-ink-muted/80">
                  Expires {formatDateTime(row.expiresAt)} · Updated{" "}
                  {formatDateTime(row.updatedAt)}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                loading={busyEmail === row.email}
                onClick={() => handleUnsuppress(row.email)}
              >
                <ShieldCheck className="size-3.5" aria-hidden />
                Unsuppress
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
