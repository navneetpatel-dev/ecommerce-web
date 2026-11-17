"use client";

import { CollapsibleTableFilters } from "@/shared/components/filters";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  useBugReportFiltersHandlers,
  ALL,
} from "../../../hooks/filters/useBugReportFiltersHandlers.hook";
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
    currentSearch,
    currentStatus,
    currentSeverity,
    currentModule,
    currentReporterRole,
    handleSearchChange,
    handleClear,
    handleStatusChange,
    handleSeverityChange,
    handleModuleChange,
    handleReporterRoleChange,
  } = useBugReportFiltersHandlers();

  const activeCount =
    (currentSearch.trim() ? 1 : 0) +
    (currentStatus && currentStatus !== ALL ? 1 : 0) +
    (currentSeverity && currentSeverity !== ALL ? 1 : 0) +
    (currentModule && currentModule !== ALL ? 1 : 0) +
    (currentReporterRole && currentReporterRole !== ALL ? 1 : 0);

  return (
    <CollapsibleTableFilters activeCount={activeCount} onClear={handleClear}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
        <FormFieldFrame label={LABELS.search} htmlFor="bug-filter-search">
          <Input
            id="bug-filter-search"
            value={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title or BUG-#"
          />
        </FormFieldFrame>
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
        {activeCount > 0 && (
          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={handleClear}>
              {LABELS.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </CollapsibleTableFilters>
  );
}
