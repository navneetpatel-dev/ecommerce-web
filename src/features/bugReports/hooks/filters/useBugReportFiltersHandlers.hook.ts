import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ALL = "ALL";

export function useBugReportFiltersHandlers() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!value || value === ALL) next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const handleStatusChange = useCallback(
    (v: string) => {
      setParam("status", v);
    },
    [setParam],
  );

  const handleSeverityChange = useCallback(
    (v: string) => {
      setParam("severity", v);
    },
    [setParam],
  );

  const handleModuleChange = useCallback(
    (v: string) => {
      setParam("affectedModule", v);
    },
    [setParam],
  );

  const handleReporterRoleChange = useCallback(
    (v: string) => {
      setParam("reporterRole", v);
    },
    [setParam],
  );

  const currentStatus = searchParams.get("status") ?? ALL;
  const currentSeverity = searchParams.get("severity") ?? ALL;
  const currentModule = searchParams.get("affectedModule") ?? ALL;
  const currentReporterRole = searchParams.get("reporterRole") ?? ALL;

  return {
    currentStatus,
    currentSeverity,
    currentModule,
    currentReporterRole,
    handleStatusChange,
    handleSeverityChange,
    handleModuleChange,
    handleReporterRoleChange,
  };
}
