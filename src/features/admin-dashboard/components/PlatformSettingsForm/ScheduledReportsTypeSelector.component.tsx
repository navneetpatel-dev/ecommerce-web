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
import { platformSettingsFormStyles as styles } from "./platformSettingsForm.styles";

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
    <div className={styles.selectorContainer}>
      {/* Header bar: Title, Count Badge, and Bulk Actions */}
      <div className={styles.selectorHeaderRow}>
        <div className={styles.selectorHeaderTitleGroup}>
          <div className={styles.selectorHeaderTitleBadgeRow}>
            <h4 className={styles.selectorHeaderTitle}>
              {LABELS.scheduledReportsTypes}
            </h4>
            <span className={styles.selectorCountBadge}>
              {selectedTypes.length} / {catalog.length}{" "}
              {LABELS.scheduledReportsSelectedCount}
            </span>
          </div>
          <p className={styles.selectorHeaderSubtitle}>
            {LABELS.scheduledReportsTypesHint}
          </p>
        </div>

        <div className={styles.selectorHeaderActions}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectVisible}
            className={styles.selectorSelectAllButton}
          >
            <CheckSquare className={styles.selectorSelectAllIcon} />
            {LABELS.scheduledReportsSelectAll}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearVisible}
            disabled={selectedTypes.length === 0}
            className={styles.selectorClearAllButton}
          >
            <Square className={styles.selectorClearAllIcon} />
            {LABELS.scheduledReportsClearAll}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar using shared Tabs component */}
      <div className={styles.selectorFilterSearchBar}>
        <Tabs
          value={activeCategory}
          onValueChange={(val) =>
            setActiveCategory(val as ScheduledReportsCategoryKey)
          }
          className={styles.tabsRoot}
        >
          <TabsList className={styles.tabsList}>
            {CATEGORIES.map(({ key, label }) => (
              <TabsTrigger key={key} value={key} className={styles.tabTrigger}>
                <span>{label}</span>
                <span className={styles.tabCountBadge}>{counts[key]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <Input
            id={searchInputId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={LABELS.scheduledReportsSearchPlaceholder}
            className={styles.searchInput}
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className={styles.searchClearButton}
              aria-label="Clear search"
            >
              <X className={styles.searchClearIcon} />
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
