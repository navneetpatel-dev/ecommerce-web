"use client";

import { useId } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Search, X, CheckSquare, Square } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { ScheduledReportTypeOption } from "../../hooks/useScheduledReportsCatalog.hook";
import {
  useScheduledReportsFilter,
  type ScheduledReportsCategoryKey,
} from "../../hooks/useScheduledReportsFilter.hook";
import { ReportTypeCheckboxGroup } from "./ReportTypeCheckboxGroup.component";

interface ScheduledReportsTypeSelectorProps {
  catalog: ScheduledReportTypeOption[];
  selectedTypes: string[];
  onChange: (nextTypes: string[]) => void;
}

const CATEGORIES: { key: ScheduledReportsCategoryKey; label: string }[] = [
  { key: "all", label: LABELS.scheduledReportsCategoryAll },
  { key: "admin_finance", label: LABELS.scheduledReportsCategoryFinance },
  { key: "admin_ops", label: LABELS.scheduledReportsCategoryOps },
  { key: "admin_catalog", label: LABELS.scheduledReportsCategoryCatalog },
];

export function ScheduledReportsTypeSelector({
  catalog,
  selectedTypes,
  onChange,
}: ScheduledReportsTypeSelectorProps) {
  const searchInputId = useId();
  const {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    counts,
    filteredReports,
    toggleType,
    selectVisible,
    clearVisible,
    resetFilters,
  } = useScheduledReportsFilter(catalog, selectedTypes, onChange);

  return (
    <div className="space-y-4">
      {/* Header bar: Title, Count Badge, and Bulk Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h4 className="text-body font-semibold text-ink">
              {LABELS.scheduledReportsTypes}
            </h4>
            <span className="inline-flex items-center rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-semibold text-brand">
              {selectedTypes.length} / {catalog.length}{" "}
              {LABELS.scheduledReportsSelectedCount}
            </span>
          </div>
          <p className="text-body-sm text-ink-muted">
            {LABELS.scheduledReportsTypesHint}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectVisible}
            className="gap-1.5"
          >
            <CheckSquare className="size-4 text-brand" />
            {LABELS.scheduledReportsSelectAll}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearVisible}
            disabled={selectedTypes.length === 0}
            className="gap-1.5 text-ink-muted hover:text-ink"
          >
            <Square className="size-4 text-ink-muted" />
            {LABELS.scheduledReportsClearAll}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar using shared Tabs component */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeCategory}
          onValueChange={(val) =>
            setActiveCategory(val as ScheduledReportsCategoryKey)
          }
          className="shrink-0"
        >
          <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-md border border-line-strong bg-paper p-1">
            {CATEGORIES.map(({ key, label }) => (
              <TabsTrigger
                key={key}
                value={key}
                className="group gap-1.5 rounded-sm border-0 border-b-0 px-3 py-1.5 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-brand data-[state=active]:text-paper data-[state=active]:hover:bg-brand-hover"
              >
                <span>{label}</span>
                <span className="inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none bg-line-strong/60 text-ink-muted group-data-[state=active]:bg-paper group-data-[state=active]:text-brand">
                  {counts[key]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64 sm:max-w-64 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint pointer-events-none" />
          <Input
            id={searchInputId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={LABELS.scheduledReportsSearchPlaceholder}
            className="pl-10 pr-10"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-ink-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Reports Grid */}
      <ReportTypeCheckboxGroup
        reports={filteredReports}
        selectedTypes={selectedTypes}
        onToggle={toggleType}
        onResetFilters={resetFilters}
      />
    </div>
  );
}
