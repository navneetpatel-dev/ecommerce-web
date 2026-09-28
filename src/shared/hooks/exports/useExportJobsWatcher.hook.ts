"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";
import { exportJobsApi } from "@/shared/api/exports/exportJobs.api";
import { LABELS } from "@/shared/constants/labels";
import { useExportJobsSocket } from "./useExportJobsSocket.hook";

const POLL_INTERVAL_MS = 4_000;
/** A job is "stale" for polling purposes once the socket hasn't confirmed it in 2 poll windows. */
const SOCKET_STALE_AFTER_MS = POLL_INTERVAL_MS * 2;

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

  // Connection lifecycle, room joins on connect, and socket event wiring all
  // live in the socket hook; completion handling stays here because it also
  // triggers the download.
  useExportJobsSocket({
    hasActiveJobs: activeJobIds.length > 0,
    socketRef,
    joinedRoomsRef,
    lastSocketEventAtRef,
    onCompleted: handleCompleted,
  });

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
