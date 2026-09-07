"use client";

import { useId, useMemo, useState } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Search, X, CheckSquare, Square } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import type { ScheduledReportTypeOption } from "../../hooks/useScheduledReportsCatalog.hook";

interface ScheduledReportsTypeSelectorProps {
  catalog: ScheduledReportTypeOption[];
  selectedTypes: string[];
  onChange: (nextTypes: string[]) => void;
}

type CategoryKey = "all" | "admin_finance" | "admin_ops" | "admin_catalog";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: LABELS.scheduledReportsCategoryAll },
  { key: "admin_finance", label: LABELS.scheduledReportsCategoryFinance },
  { key: "admin_ops", label: LABELS.scheduledReportsCategoryOps },
  { key: "admin_catalog", label: LABELS.scheduledReportsCategoryCatalog },
];

function getCategoryLabel(audience?: string, financial?: boolean): string {
  if (audience === "admin_finance" || financial) return "Finance";
  if (audience === "admin_ops") return "Operations";
  return "Catalog";
}

export function ScheduledReportsTypeSelector({
  catalog,
  selectedTypes,
  onChange,
}: ScheduledReportsTypeSelectorProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const searchInputId = useId();

  const counts = useMemo(
    () => ({
      all: catalog.length,
      admin_finance: catalog.filter(
        (r) => r.audience === "admin_finance" || r.financial,
      ).length,
      admin_ops: catalog.filter((r) => r.audience === "admin_ops").length,
      admin_catalog: catalog.filter(
        (r) => r.audience === "admin_catalog" && !r.financial,
      ).length,
    }),
    [catalog],
  );

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((item) => {
      const isFin = item.audience === "admin_finance" || item.financial;
      const isOps = item.audience === "admin_ops";
      const isCat = item.audience === "admin_catalog" && !item.financial;
      const matchesCat =
        activeCategory === "all" ||
        (activeCategory === "admin_finance" && isFin) ||
        (activeCategory === "admin_ops" && isOps) ||
        (activeCategory === "admin_catalog" && isCat);
      return (
        matchesCat &&
        (!q ||
          item.label.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q))
      );
    });
  }, [catalog, activeCategory, search]);

  const toggleType = (type: string) => {
    onChange(
      selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type],
    );
  };

  const selectVisible = () => {
    onChange(
      Array.from(
        new Set([...selectedTypes, ...filteredReports.map((r) => r.type)]),
      ),
    );
  };

  const clearVisible = () => {
    const visible = new Set(filteredReports.map((r) => r.type));
    onChange(selectedTypes.filter((t) => !visible.has(t)));
  };

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
          onValueChange={(val) => setActiveCategory(val as CategoryKey)}
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
      {filteredReports.length === 0 ? (
        <div className="py-10 text-center rounded-md border border-dashed border-line bg-surface/40">
          <p className="text-body font-medium text-ink-muted">
            {LABELS.scheduledReportsNoMatches}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
            }}
            className="mt-2 text-brand text-xs"
          >
            Reset search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 pt-1">
          {filteredReports.map((option) => {
            const isChecked = selectedTypes.includes(option.type);
            const category = getCategoryLabel(
              option.audience,
              option.financial,
            );
            return (
              <label
                key={option.type}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer select-none",
                  isChecked
                    ? "border-brand bg-brand-subtle/30 text-ink shadow-xs ring-1 ring-brand/20"
                    : "border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-raised",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleType(option.type)}
                  />
                  <span
                    className={cn(
                      "truncate text-body-sm",
                      isChecked
                        ? "font-semibold text-ink"
                        : "font-normal text-ink",
                    )}
                  >
                    {option.label}
                  </span>
                </div>
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider text-ink-faint group-hover:text-ink-muted">
                  {category}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
