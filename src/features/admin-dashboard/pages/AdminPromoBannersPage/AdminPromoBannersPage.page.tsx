"use client";

import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions";
import type { PromoBannerStatus } from "@/shared/constants/statuses";
import { usePromoBanners } from "./usePromoBanners.hook";
import { PromoBannerCreateSection } from "./PromoBannerCreateSection.component";
import { PromoBannersList } from "./PromoBannersList.component";

export function AdminPromoBannersPage() {
  const promo = usePromoBanners();

  return (
    <RequirePermission permission={PERMISSIONS.BANNER_MANAGE}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.promoBanners}
          </h2>
          <p className="max-w-2xl text-body text-ink-muted">
            {LABELS.promoBannersHint}
          </p>
        </div>

        <PromoBannerCreateSection
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
          onCreate={() => void promo.onCreate()}
        />

        {promo.loading ? (
          <p className="text-ink-muted">{LABELS.loading}</p>
        ) : null}
        {promo.error ? <p className="text-danger">{promo.error}</p> : null}
        {!promo.loading && !promo.error && promo.banners.length === 0 ? (
          <p className="text-ink-muted">{LABELS.noPromoBanners}</p>
        ) : null}

        {!promo.loading && promo.banners.length > 0 ? (
          <PromoBannersList
            banners={promo.banners}
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
            onSaveEdit={() => void promo.onSaveEdit()}
            onStartEdit={promo.startEdit}
            onActivate={(banner) => void promo.onActivate(banner)}
            onDelete={(banner) => void promo.onDelete(banner)}
          />
        ) : null}
      </div>
    </RequirePermission>
  );
}
