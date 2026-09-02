"use client";

import { useState } from "react";
import { LogOut, Monitor } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FormError } from "@/shared/components/FormError.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { ChangePasswordSection } from "@/features/auth";
import { useProfilePage } from "@/features/auth";
import {
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "@/features/auth";
import { formatSessionDateTime } from "@/shared/utils/formatDate";

function deviceLabel(userAgent: string | null) {
  if (!userAgent) return "Unknown device";
  const ua = userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad")) return "Apple device";
  if (ua.includes("android")) return "Android device";
  if (ua.includes("mac")) return "Mac";
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("linux")) return "Linux";
  return "Browser session";
}

export function SecuritySection() {
  const profile = useProfilePage();
  const sessions = useSessions();
  const revoke = useRevokeSession();
  const revokeOthers = useRevokeOtherSessions();
  const [revokeOthersOpen, setRevokeOthersOpen] = useState(false);
  const [revokeFamily, setRevokeFamily] = useState<string | null>(null);

  const list = sessions.data ?? [];
  const hasOthers = list.some((s) => !s.isCurrent);
  const revokeTarget = list.find((s) => s.family === revokeFamily) ?? null;

  return (
    <div className="space-y-6">
      <ChangePasswordSection
        form={profile.form}
        onSubmit={profile.onSubmit}
        error={profile.error}
        isPending={profile.isPending}
        isSuccess={profile.isSuccess}
        onChangeAgain={profile.resetSuccess}
      />

      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-[1.125rem] text-ink">
              Active sessions
            </h2>
            <p className="mt-0.5 text-body-sm text-ink-muted">
              Devices signed in with your account.
            </p>
          </div>
          {hasOthers ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRevokeOthersOpen(true)}
            >
              Sign out others
            </Button>
          ) : null}
        </div>

        {sessions.isLoading ? (
          <div className="space-y-3 p-5">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : sessions.isError ? (
          <div className="px-5 py-8 text-center">
            <QueryErrorAlert
              error={sessions.error}
              fallback={LABELS.couldNotLoadSessions}
            />
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={Monitor}
            heading="No active sessions"
            message="Sign in again to see devices here."
            className="py-12 md:py-14"
            maxWidth="max-w-sm"
          />
        ) : (
          <ul className="divide-y divide-line">
            {list.map((session) => (
              <li
                key={session.family}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {deviceLabel(session.userAgent)}
                    {session.isCurrent ? (
                      <span className="ml-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
                        This device
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-body-sm text-ink-muted">
                    {session.ipAddress || "IP unknown"} · Last active{" "}
                    <time dateTime={session.lastUsedAt}>
                      {formatSessionDateTime(session.lastUsedAt)}
                    </time>
                  </p>
                </div>
                {!session.isCurrent ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger hover:text-danger"
                    onClick={() => setRevokeFamily(session.family)}
                  >
                    Revoke
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <div className="px-5 pb-4">
          <FormError
            error={(revoke.error || revokeOthers.error) as Error | null}
            fallback="Could not update sessions."
          />
        </div>
      </section>

      <StatusDialog
        open={revokeOthersOpen}
        onOpenChange={setRevokeOthersOpen}
        variant="warning"
        icon={LogOut}
        title="Sign out other devices?"
        description="All sessions except this one will be ended. Those devices will need to sign in again."
        secondaryAction={{
          label: "Cancel",
          onClick: () => setRevokeOthersOpen(false),
        }}
        primaryAction={{
          label: "Sign out others",
          loading: revokeOthers.isPending,
          onClick: () => {
            revokeOthers.mutate(undefined, {
              onSuccess: () => setRevokeOthersOpen(false),
            });
          },
        }}
      />

      <StatusDialog
        open={Boolean(revokeFamily)}
        onOpenChange={(open) => {
          if (!open) setRevokeFamily(null);
        }}
        variant="warning"
        icon={LogOut}
        title="Revoke this session?"
        description={
          revokeTarget
            ? `End the session on ${deviceLabel(revokeTarget.userAgent)}. That device will need to sign in again.`
            : "End this session. That device will need to sign in again."
        }
        secondaryAction={{
          label: "Cancel",
          onClick: () => setRevokeFamily(null),
        }}
        primaryAction={{
          label: "Revoke",
          variant: "destructive",
          loading: revoke.isPending,
          onClick: () => {
            if (!revokeFamily) return;
            revoke.mutate(revokeFamily, {
              onSuccess: () => setRevokeFamily(null),
            });
          },
        }}
      />
    </div>
  );
}
