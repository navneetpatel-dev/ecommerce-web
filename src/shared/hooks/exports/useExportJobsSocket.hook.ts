"use client";

import { useEffect, type RefObject } from "react";
import type { Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/shared/config/appConfig";
import { getApiSessionAdapter } from "@/shared/api/client/sessionAdapter";
import { useExportJobsStore } from "@/shared/stores/exports/exportJobs.store";

type ProgressEvent = {
  jobId: string;
  rowsProcessed: number;
  total: number | null;
};
type CompletedEvent = { jobId: string };
type FailedEvent = { jobId: string; message?: string };

interface UseExportJobsSocketParams {
  /** The connection opens while any job is active and closes once none is. */
  hasActiveJobs: boolean;
  socketRef: RefObject<Socket | null>;
  joinedRoomsRef: RefObject<Set<string>>;
  /** Per-job timestamp of the last socket event, used by the polling fallback. */
  lastSocketEventAtRef: RefObject<Map<string, number>>;
  /** Called when the server reports a job finished. */
  onCompleted: (jobId: string) => void;
}

/**
 * Owns the single Socket.IO connection for every currently-tracked export job:
 * connects only while a job is active, joins one room per active job on that
 * one connection, and disconnects once every job is done. Room membership for
 * jobs that appear later is handled by the caller's room-membership effect.
 */
export function useExportJobsSocket({
  hasActiveJobs,
  socketRef,
  joinedRoomsRef,
  lastSocketEventAtRef,
  onCompleted,
}: UseExportJobsSocketParams) {
  const updateJob = useExportJobsStore((s) => s.updateJob);

  useEffect(() => {
    if (!hasActiveJobs) {
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

      // The room-membership effect can run while this `import()` is still
      // pending (`socketRef` is still null), so it would no-op and never
      // re-run unless the active-job key changes. Join whatever is currently
      // active the moment the socket exists so the first job of a session
      // actually gets a room.
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
        // errorMessage: null clears a stale client-side-only annotation — the
        // "Too late to cancel" message is never written to the backend, so a
        // real progress event (proof-positive the job hasn't failed) is the
        // natural point to drop it.
        updateJob(event.jobId, {
          status: "PROCESSING",
          progressPercent: percent,
          errorMessage: null,
        });
      });
      socket.on("export:completed", (event: CompletedEvent) => {
        lastSocketEventAtRef.current.set(event.jobId, Date.now());
        onCompleted(event.jobId);
      });
      socket.on("export:failed", (event: FailedEvent) => {
        lastSocketEventAtRef.current.set(event.jobId, Date.now());
        updateJob(event.jobId, {
          status: "FAILED",
          errorMessage: event.message ?? null,
        });
      });
      // A dropped connection doesn't clear lastSocketEventAtRef entries, so
      // every tracked job's poll fallback naturally re-arms once its entry
      // goes stale — no separate "am I connected" flag needed.
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveJobs]);
}
