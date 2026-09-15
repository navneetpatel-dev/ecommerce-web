"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/shared/config/appConfig";
import { getApiSessionAdapter } from "@/shared/api/client/sessionAdapter";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { LABELS } from "@/shared/constants/labels";

const POLL_INTERVAL_MS = 4_000;
/** A job is "stale" for polling purposes once the socket hasn't confirmed it in 2 poll windows. */
const SOCKET_STALE_AFTER_MS = POLL_INTERVAL_MS * 2;

type ProgressEvent = {
  jobId: string;
  rowsProcessed: number;
  total: number | null;
};
type CompletedEvent = { jobId: string };
type FailedEvent = { jobId: string; message?: string };

/**
 * Mounted exactly once (inside ExportJobsTrayContainer, Step 20). Owns the
 * single Socket.IO connection for every currently-tracked export job —
 * connects only while `activeJobIds.length > 0`, joins one room per active
 * job on that one connection, and disconnects once every job is done.
 */
export function useExportJobsWatcher() {
  const jobs = useExportJobsStore((s) => s.jobs);
  const updateJob = useExportJobsStore((s) => s.updateJob);

  const socketRef = useRef<Socket | null>(null);
  const joinedRoomsRef = useRef(new Set<string>());
  const downloadedRef = useRef(new Set<string>());
  const lastSocketEventAtRef = useRef(new Map<string, number>());
  const pollTimersRef = useRef(
    new Map<string, ReturnType<typeof setInterval>>(),
  );

  const activeJobIds = jobs
    .filter((j) => j.status === "QUEUED" || j.status === "PROCESSING")
    .map((j) => j.jobId);
  const activeJobIdsKey = activeJobIds.join(",");

  async function handleCompleted(jobId: string) {
    updateJob(jobId, { status: "COMPLETED", progressPercent: 100 });
    if (downloadedRef.current.has(jobId)) return; // guards against a duplicate download if both the socket and a poll observe completion
    downloadedRef.current.add(jobId);
    try {
      const { url } = await exportJobsApi.downloadUrl(jobId);
      const a = document.createElement("a");
      a.href = url;
      a.click();
    } catch {
      updateJob(jobId, { errorMessage: LABELS.exportDownloadLinkFailed });
    }
  }

  // Connection lifecycle: open once something is active, close once nothing is.
  useEffect(() => {
    if (activeJobIds.length === 0) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      joinedRoomsRef.current.clear();
      return;
    }
    if (socketRef.current) return;

    let cancelled = false;
    void import("socket.io-client").then(({ io }) => {
      if (cancelled) return;
      const token = getApiSessionAdapter().getAccessToken();
      const socket = io(SOCKET_BASE_URL, {
        path: "/socket.io",
        auth: token ? { token } : {},
      });
      socketRef.current = socket;

      // The room-membership effect below can run while this `import()` is
      // still pending (`socketRef` is still null), so it would no-op and
      // never re-run unless `activeJobIdsKey` changes. Join whatever is
      // currently active the moment the socket exists so the first job of
      // a session actually gets a room.
      const currentlyActive = useExportJobsStore
        .getState()
        .jobs.filter((j) => j.status === "QUEUED" || j.status === "PROCESSING")
        .map((j) => j.jobId);
      for (const jobId of currentlyActive) {
        if (joinedRoomsRef.current.has(jobId)) continue;
        joinedRoomsRef.current.add(jobId);
        socket.emit(
          "subscribe:export-job",
          { jobId },
          (res?: { ok: boolean; message?: string }) => {
            if (!res?.ok) {
              console.warn(
                `[exports] subscribe failed for ${jobId} — falling back to polling`,
                res?.message,
              );
            }
          },
        );
      }

      socket.on("export:progress", (event: ProgressEvent) => {
        lastSocketEventAtRef.current.set(event.jobId, Date.now());
        const percent = event.total
          ? Math.min(99, Math.round((event.rowsProcessed / event.total) * 100))
          : 0;
        // errorMessage: null clears a stale *client-side-only* annotation
        // — specifically, Step 20's "Too late to cancel" message, which is
        // never written to the backend and therefore never naturally goes
        // away on its own. `updateJob` shallow-merges, so without this a
        // lost-the-cancel-race warning would sit on screen indefinitely
        // even after the export goes on to progress normally and complete
        // — stale, contradicted-by-what's-happening-now text is exactly
        // the "is the user actually being told the truth" bar this whole
        // audit is holding the UI to. Safe to clear unconditionally here:
        // a real `export:progress` event is proof-positive the job hasn't
        // failed, so there is no scenario where clearing it here discards
        // information the user still needs.
        updateJob(event.jobId, {
          status: "PROCESSING",
          progressPercent: percent,
          errorMessage: null,
        });
      });
      socket.on("export:completed", (event: CompletedEvent) => {
        lastSocketEventAtRef.current.set(event.jobId, Date.now());
        void handleCompleted(event.jobId);
      });
      socket.on("export:failed", (event: FailedEvent) => {
        lastSocketEventAtRef.current.set(event.jobId, Date.now());
        updateJob(event.jobId, {
          status: "FAILED",
          errorMessage: event.message ?? null,
        });
      });
      // A dropped connection doesn't clear lastSocketEventAtRef entries, so
      // every tracked job's poll fallback (below) naturally re-arms once
      // its entry goes stale — no separate "am I connected" flag needed.
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJobIds.length > 0]);

  // Room membership: join newly-active jobs on the existing connection.
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    for (const jobId of activeJobIds) {
      if (joinedRoomsRef.current.has(jobId)) continue;
      joinedRoomsRef.current.add(jobId);
      // The ack matters here, deliberately — without it, a rejected
      // subscription (the backend's ownership check in `socket.ts` failing,
      // or the job row not existing yet due to a rare race with the DB
      // write in exports.service.ts) is completely invisible: the poll
      // fallback still functionally covers it (this job's
      // `lastSocketEventAtRef` entry simply never gets set, so it reads as
      // stale from the very first check), but silently falling back with
      // no signal at all makes a genuine bug indistinguishable from normal
      // degraded-network behavior. Logging it costs nothing and keeps the
      // two cases tell-apart-able.
      socket.emit(
        "subscribe:export-job",
        { jobId },
        (res?: { ok: boolean; message?: string }) => {
          if (!res?.ok) {
            console.warn(
              `[exports] subscribe failed for ${jobId} — falling back to polling`,
              res?.message,
            );
          }
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJobIdsKey]);

  // Per-job poll fallback — only actually hits the network for a job whose
  // socket room hasn't confirmed it recently; a healthy socket makes this
  // a no-op timer tick, not a wasted request.
  useEffect(() => {
    for (const jobId of activeJobIds) {
      if (pollTimersRef.current.has(jobId)) continue;
      const timer = setInterval(() => {
        const lastEvent = lastSocketEventAtRef.current.get(jobId) ?? 0;
        if (Date.now() - lastEvent < SOCKET_STALE_AFTER_MS) return;
        void exportJobsApi
          .status(jobId)
          .then((status) => {
            updateJob(jobId, {
              status: status.status,
              progressPercent: status.progressPercent,
              filename: status.filename,
              errorMessage: status.errorMessage,
            });
            if (status.status === "COMPLETED") void handleCompleted(jobId);
          })
          .catch(() => undefined);
      }, POLL_INTERVAL_MS);
      pollTimersRef.current.set(jobId, timer);
    }
    for (const [jobId, timer] of pollTimersRef.current) {
      if (!activeJobIds.includes(jobId)) {
        clearInterval(timer);
        pollTimersRef.current.delete(jobId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJobIdsKey]);

  // Full teardown on unmount (tray is mounted for the app's lifetime, so in
  // practice this only fires on hot-reload / true app teardown).
  useEffect(
    () => () => {
      socketRef.current?.disconnect();
      for (const timer of pollTimersRef.current.values()) clearInterval(timer);
    },
    [],
  );
}
