"use client";

import { useMemo, useState } from "react";
import type { ScheduledReportTypeOption } from "./useScheduledReportsCatalog.hook";

export type ScheduledReportsCategoryKey =
  "all" | "admin_finance" | "admin_ops" | "admin_catalog";

/** Search/category filtering + bulk-select actions for the scheduled-reports type grid. */
export function useScheduledReportsFilter(
  catalog: ScheduledReportTypeOption[],
  selectedTypes: string[],
  onChange: (nextTypes: string[]) => void,
) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ScheduledReportsCategoryKey>("all");

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

  const resetFilters = () => {
    setSearch("");
    setActiveCategory("all");
  };

  return {
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
  };
}
