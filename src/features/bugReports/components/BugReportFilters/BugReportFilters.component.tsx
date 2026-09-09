"use client";

import { bugReportFiltersStyles } from "./bugReportFilters.styles";
import { useBugReportFiltersHandlers } from "./useBugReportFiltersHandlers.hook";
import { BugStatusFilterSelect } from "./BugStatusFilterSelect.component";
import { BugSeverityFilterSelect } from "./BugSeverityFilterSelect.component";
import { BugModuleFilterSelect } from "./BugModuleFilterSelect.component";
import { BugReporterRoleFilterSelect } from "./BugReporterRoleFilterSelect.component";

interface BugReportFiltersProps {
  /** Admin queue shows module + reporter role; reporters only status + severity. */
  variant?: "admin" | "reporter";
}

export function BugReportFilters({ variant = "admin" }: BugReportFiltersProps) {
  const isAdmin = variant === "admin";
  const {
    currentStatus,
    currentSeverity,
    currentModule,
    currentReporterRole,
    handleStatusChange,
    handleSeverityChange,
    handleModuleChange,
    handleReporterRoleChange,
  } = useBugReportFiltersHandlers();

  return (
    <div className={bugReportFiltersStyles.container(isAdmin)}>
      <BugStatusFilterSelect
        value={currentStatus}
        onChange={handleStatusChange}
      />
      <BugSeverityFilterSelect
        value={currentSeverity}
        onChange={handleSeverityChange}
      />
      {isAdmin ? (
        <>
          <BugModuleFilterSelect
            value={currentModule}
            onChange={handleModuleChange}
          />
          <BugReporterRoleFilterSelect
            value={currentReporterRole}
            onChange={handleReporterRoleChange}
          />
        </>
      ) : null}
    </div>
  );
}
