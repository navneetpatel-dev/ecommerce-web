import { STORAGE_KEYS } from "@/shared/constants/storage";

/**
 * Crash/error reporting (Rule 20). A single pluggable transport is
 * initialized once by `ErrorReportingProvider` in the root providers tree.
 * The default transport logs a redacted, structured payload; a crash SDK
 * (e.g. Sentry) can be attached via `setCrashReportingTransport` without
 * touching call sites.
 */

export interface ErrorReportContext {
  boundary?: string;
  digest?: string;
  extra?: Record<string, string>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  path: string;
  boundary?: string;
  digest?: string;
  timestamp: string;
}

type CrashReportingTransport = (report: ErrorReport) => void;

let transport: CrashReportingTransport = defaultTransport;
let initialized = false;

function defaultTransport(report: ErrorReport): void {
  console.error("[error-report]", report);
}

/** Redacts anything that looks like a stored token before reporting. */
function redact(input: string): string {
  const tokenValue = safeRead(STORAGE_KEYS.ACCESS_TOKEN);
  if (!tokenValue) return input;
  return input.split(tokenValue).join("[redacted]");
}

function safeRead(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // Storage unavailable — nothing to redact.
    return null;
  }
}

function toReport(error: unknown, context: ErrorReportContext): ErrorReport {
  const raw =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { message: String(error), stack: undefined };
  return {
    message: redact(raw.message),
    stack: raw.stack ? redact(raw.stack) : undefined,
    path: typeof window !== "undefined" ? window.location.pathname : "",
    boundary: context.boundary,
    digest: context.digest,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Reports an unexpected error through the configured transport. Expected
 * errors (validation failures, permission denials) should NOT be routed
 * here — surface them via named UI states instead (Rule 20).
 */
export function reportError(
  error: unknown,
  context: ErrorReportContext = {},
): void {
  try {
    transport(toReport(error, context));
  } catch {
    // Reporting must never itself crash the app.
  }
}

/** Installs global listeners for uncaught errors and rejections. Idempotent. */
export function initErrorReporting(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  window.addEventListener("error", (event) => {
    reportError(event.error ?? event.message, { boundary: "window" });
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportError(event.reason, { boundary: "unhandledrejection" });
  });
}

/** Attaches a real crash SDK transport (Sentry etc.). Passes redacted reports. */
export function setCrashReportingTransport(
  next: CrashReportingTransport,
): void {
  transport = next;
}
