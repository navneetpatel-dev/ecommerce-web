"use client";

import { useMemo, useState } from "react";
import { ImagePlus, Plus, RotateCcw, Search } from "lucide-react";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { PromoBannerStatus } from "@/shared/constants/statuses";
import { usePromoBanners } from "./usePromoBanners.hook";
import { PromoBannerCreateDialog } from "./PromoBannerCreateSection.component";
import { PromoBannersList } from "./PromoBannersList.component";
import { adminPromoBannersPageStyles } from "./adminPromoBanners.styles";

export function AdminPromoBannersPage() {
  const promo = usePromoBanners();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredBanners = useMemo(() => {
    return promo.banners.filter((banner) => {
      if (statusFilter !== "ALL" && banner.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = banner.title.toLowerCase().includes(q);
        const matchUrl = banner.linkUrl
          ? banner.linkUrl.toLowerCase().includes(q)
          : false;
        const matchTarget = banner.linkTargetId
          ? banner.linkTargetId.toLowerCase().includes(q)
          : false;
        const matchSlug = banner.linkSlug
          ? banner.linkSlug.toLowerCase().includes(q)
          : false;
        if (!matchTitle && !matchUrl && !matchTarget && !matchSlug) {
          return false;
        }
      }
      return true;
    });
  }, [promo.banners, statusFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  return (
    <RequirePermission permission={PERMISSIONS.BANNER_MANAGE}>
      <div className={adminPromoBannersPageStyles.container}>
        {/* Top Header with title and Top-Right Action Button that opens the Modal */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className={adminPromoBannersPageStyles.headerGroup}>
            <h1 className={adminPromoBannersPageStyles.heading}>
              {LABELS.promoBanners}
            </h1>
            <p className={adminPromoBannersPageStyles.subheading}>
              {LABELS.promoBannersHint}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => promo.setIsCreateOpen(true)}
            className="gap-2"
          >
            <Plus className="size-4" aria-hidden />
            <span>{LABELS.createPromoBanner}</span>
          </Button>
        </header>

        {/* Promo Banner Create Modal Dialog */}
        <PromoBannerCreateDialog
          open={promo.isCreateOpen}
          onOpenChange={promo.setIsCreateOpen}
          draftId={promo.draftId}
          title={promo.title}
          onTitleChange={promo.setTitle}
          imageUrl={promo.imageUrl}
          onImageUploaded={promo.setImageUrl}
          linkType={promo.linkType}
          onLinkTypeChange={promo.setLinkType}
          status={promo.status}
          onStatusChange={promo.setStatus}
          linkUrl={promo.linkUrl}
          onLinkUrlChange={promo.setLinkUrl}
          linkTargetId={promo.linkTargetId}
          onLinkTargetIdChange={promo.setLinkTargetId}
          priority={promo.priority}
          onPriorityChange={promo.setPriority}
          saving={promo.saving}
          message={promo.message}
          canSubmit={promo.canSubmit}
          disableHint={promo.disableHint}
          onCreate={promo.onCreate}
        />

        {promo.loading ? (
          <p className={adminPromoBannersPageStyles.loadingText}>
            {LABELS.loading}
          </p>
        ) : null}

        {promo.error ? (
          <p role="alert" className={adminPromoBannersPageStyles.errorText}>
            {promo.error}
          </p>
        ) : null}

        {!promo.loading && !promo.error && promo.banners.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              icon={ImagePlus}
              heading={LABELS.noPromoBanners}
              message={LABELS.promoBannersEmptyHint}
            />
            <div className="flex justify-center">
              <Button
                type="button"
                variant="default"
                onClick={() => promo.setIsCreateOpen(true)}
                className="gap-2"
              >
                <Plus className="size-4" />
                {LABELS.createPromoBanner}
              </Button>
            </div>
          </div>
        ) : null}

        {!promo.loading && promo.banners.length > 0 ? (
          <div className="space-y-4">
            {/* Header & Filter Controls for the Banners List */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-line/80 pt-6">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-body font-semibold tracking-tight text-ink">
                    Configured Banners
                  </h2>
                  <Badge variant="outline" className="text-caption font-medium">
                    {filteredBanners.length}{" "}
                    {filteredBanners.length === 1 ? "banner" : "banners"}
                  </Badge>
                </div>
                <p className="text-body-sm text-ink-muted">
                  Manage active, draft, and scheduled hero banners for the
                  storefront.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative min-w-[200px] flex-1 sm:w-60 sm:flex-initial">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <Input
                    type="search"
                    placeholder="Search banners..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-body-sm"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] h-9 text-body-sm">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || statusFilter !== "ALL") && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-9 gap-1 text-ink-muted hover:text-ink"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {filteredBanners.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface p-8 text-center">
                <p className="text-body font-medium text-ink">
                  No banners found matching your filters
                </p>
                <p className="mt-1 text-body-sm text-ink-muted">
                  Try adjusting your search query or status filter.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mt-4 gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear Filters
                </Button>
              </div>
            ) : (
              <PromoBannersList
                banners={filteredBanners}
                saving={promo.saving}
                editingId={promo.editingId}
                editTitle={promo.editTitle}
                onEditTitleChange={promo.setEditTitle}
                editImageUrl={promo.editImageUrl}
                onEditImageUploaded={promo.setEditImageUrl}
                editStatus={promo.editStatus as PromoBannerStatus}
                onEditStatusChange={promo.setEditStatus}
                editPriority={promo.editPriority}
                onEditPriorityChange={promo.setEditPriority}
                onCancelEdit={promo.cancelEdit}
                onSaveEdit={promo.onSaveEdit}
                onStartEdit={promo.startEdit}
                onActivate={promo.onActivate}
                onDelete={promo.requestDelete}
              />
            )}
          </div>
        ) : null}

        <StatusDialog
          open={promo.deleteTarget !== null}
          onOpenChange={promo.handleDeleteOpenChange}
          variant="danger"
          title={LABELS.confirmDeletePromoBannerTitle}
          description={formatLabel(LABELS.confirmDeletePromoBannerBody, {
            name: promo.deleteTarget?.title ?? "",
          })}
          secondaryAction={{
            label: LABELS.cancel,
            onClick: promo.cancelDelete,
          }}
          primaryAction={{
            label: LABELS.delete,
            variant: "destructive",
            onClick: promo.confirmDelete,
          }}
        />
      </div>
    </RequirePermission>
  );
}
