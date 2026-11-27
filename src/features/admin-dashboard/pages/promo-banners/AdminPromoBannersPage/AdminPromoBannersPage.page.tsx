"use client";

import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { Plus, Trash2 } from "lucide-react";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { PromoBannerStatus } from "@/shared/constants/statuses";
import { usePromoBanners } from "./usePromoBanners.hook";
import { PromoBannerCreateDialog } from "./PromoBannerCreateSection.component";
import { PromoBannersList } from "./PromoBannersList.component";
import { PromoBannersFilterBar } from "./PromoBannersFilterBar.component";
import { PromoBannersSkeleton } from "./PromoBannersSkeleton.component";
import {
  PromoBannersEmptyState,
  PromoBannersNoMatch,
} from "./PromoBannersEmpty.component";
import { adminPromoBannersPageStyles } from "./adminPromoBanners.styles";

export function AdminPromoBannersPage() {
  const promo = usePromoBanners();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const debouncedSearch = useDebouncedValue(searchQuery.trim(), 350);

  const filteredBanners = useMemo(() => {
    return promo.banners.filter((banner) => {
      if (statusFilter !== "ALL" && banner.status !== statusFilter) {
        return false;
      }
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        banner.title.toLowerCase().includes(q) ||
        (banner.linkUrl ? banner.linkUrl.toLowerCase().includes(q) : false) ||
        (banner.linkTargetId
          ? banner.linkTargetId.toLowerCase().includes(q)
          : false) ||
        (banner.linkSlug ? banner.linkSlug.toLowerCase().includes(q) : false)
      );
    });
  }, [promo.banners, statusFilter, debouncedSearch]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  return (
    <RequirePermission permission={PERMISSIONS.BANNER_MANAGE}>
      <div className={adminPromoBannersPageStyles.container}>
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

        {promo.loading ? <PromoBannersSkeleton /> : null}

        {promo.error ? (
          <p role="alert" className={adminPromoBannersPageStyles.errorText}>
            {promo.error}
          </p>
        ) : null}

        {!promo.loading && !promo.error && promo.banners.length === 0 ? (
          <PromoBannersEmptyState
            onCreateClick={() => promo.setIsCreateOpen(true)}
          />
        ) : null}

        {!promo.loading && promo.banners.length > 0 ? (
          <div className="space-y-4">
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
            </div>

            <PromoBannersFilterBar
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onResetFilters={handleResetFilters}
            />

            {filteredBanners.length === 0 ? (
              <PromoBannersNoMatch onResetFilters={handleResetFilters} />
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
                activatingId={promo.activatingId}
                onDelete={promo.requestDelete}
              />
            )}
          </div>
        ) : null}

        <StatusDialog
          icon={Trash2}
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
            onClick: promo.confirmDelete,
          }}
        />
      </div>
    </RequirePermission>
  );
}
