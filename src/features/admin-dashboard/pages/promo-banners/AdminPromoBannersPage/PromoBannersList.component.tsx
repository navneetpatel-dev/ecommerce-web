"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import type { PromoBanner } from "@/shared/api/types";
import { PromoBannerEditForm } from "./PromoBannerEditForm.component";
import { PromoBannerRowActions } from "./PromoBannerRowActions.component";
import { promoBannersListStyles } from "./adminPromoBanners.styles";

interface PromoBannersListProps {
  banners: PromoBanner[];
  saving: boolean;
  editingId: string | null;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  editImageUrl: string | null;
  onEditImageUploaded: (url: string | null) => void;
  editStatus: PromoBanner["status"];
  onEditStatusChange: (value: PromoBanner["status"]) => void;
  editPriority: string;
  onEditPriorityChange: (value: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onStartEdit: (banner: PromoBanner) => void;
  onActivate: (banner: PromoBanner) => void;
  activatingId: string | null;
  onDelete: (banner: PromoBanner) => void;
}

export function PromoBannersList({
  banners,
  saving,
  editingId,
  editTitle,
  onEditTitleChange,
  editImageUrl,
  onEditImageUploaded,
  editStatus,
  onEditStatusChange,
  editPriority,
  onEditPriorityChange,
  onCancelEdit,
  onSaveEdit,
  onStartEdit,
  onActivate,
  activatingId,
  onDelete,
}: PromoBannersListProps) {
  return (
    <ul className={promoBannersListStyles.list}>
      {banners.map((banner) => (
        <li key={banner.id} className={promoBannersListStyles.item}>
          {editingId === banner.id ? (
            <PromoBannerEditForm
              bannerId={banner.id}
              editTitle={editTitle}
              onEditTitleChange={onEditTitleChange}
              editImageUrl={editImageUrl}
              onEditImageUploaded={onEditImageUploaded}
              editStatus={editStatus}
              onEditStatusChange={onEditStatusChange}
              editPriority={editPriority}
              onEditPriorityChange={onEditPriorityChange}
              saving={saving}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
            />
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative h-14 w-24 sm:h-16 sm:w-28 shrink-0 overflow-hidden rounded-md border border-line bg-surface-muted">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-muted">
                      <ImageIcon className="h-6 w-6 opacity-40" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-body font-semibold text-ink">
                      {banner.title}
                    </p>
                    <Badge
                      variant={
                        banner.status === "ACTIVE"
                          ? "success"
                          : banner.status === "DRAFT"
                            ? "secondary"
                            : "warning"
                      }
                    >
                      {banner.status}
                    </Badge>
                    <Badge variant="outline" className="text-caption">
                      {banner.linkType}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-ink-muted">
                    {banner.linkUrl ? (
                      <span className="truncate max-w-xs font-mono text-caption">
                        {banner.linkUrl}
                      </span>
                    ) : banner.linkTargetId ? (
                      <span className="truncate max-w-xs font-mono text-caption">
                        ID: {banner.linkTargetId}
                      </span>
                    ) : null}
                    <span>
                      {LABELS.promoBannerPriority}:{" "}
                      <strong>{banner.priority}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <PromoBannerRowActions
                banner={banner}
                onStartEdit={onStartEdit}
                onActivate={onActivate}
                activating={activatingId === banner.id}
                onDelete={onDelete}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
