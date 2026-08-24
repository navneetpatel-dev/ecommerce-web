"use client";

import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import type { StorefrontVendor } from "../api/vendors.api";

interface VendorsIndexViewProps {
  vendors: StorefrontVendor[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

function vendorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function VendorsIndexView({
  vendors,
  isLoading,
  isEmpty,
}: VendorsIndexViewProps) {
  return (
    <div className="storefront-container py-8 sm:py-10 md:py-14">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <TextEyebrow className="mb-2">{LABELS.vendorsIndexEyebrow}</TextEyebrow>
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-ink md:text-[2.5rem]">
          {LABELS.allVendors}
        </h1>
        <p className="mt-3 text-body-lg text-ink-muted">
          {formatLabel(LABELS.vendorsIndexHint, { site: LABELS.brandName })}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-line bg-paper/40 p-4"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2 pt-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState
          icon={Store}
          heading={LABELS.noVendorsYet}
          message={LABELS.noVendorsYetHint}
          actionLabel={LABELS.browseProducts}
          actionTo={PATHS.products}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {vendors.map((vendor) => (
            <li key={vendor.id} className="min-w-0">
              <Link
                href={PATHS.vendorPage(vendor.slug)}
                className={cn(
                  "group/tile flex h-full flex-col rounded-lg border border-line bg-paper/40 p-4 transition-all duration-200",
                  "hover:border-brand/30 hover:bg-paper hover:shadow-elevation-1",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle text-brand transition-colors group-hover/tile:bg-brand group-hover/tile:text-paper">
                    {vendor.logoUrl ? (
                      <MediaImage
                        src={vendor.logoUrl}
                        alt=""
                        unavailableLabel={LABELS.imageNotAvailable}
                        sizes="48px"
                        imageClassName="object-cover"
                        className="absolute inset-0"
                      />
                    ) : (
                      <span className="font-display text-body leading-none">
                        {vendorInitials(vendor.businessName) || "V"}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body font-semibold text-ink transition-colors group-hover/tile:text-brand">
                      {vendor.businessName}
                    </span>
                    {vendor.description ? (
                      <span className="mt-1 line-clamp-2 text-body-sm text-ink-muted">
                        {vendor.description}
                      </span>
                    ) : null}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-brand">
                  {LABELS.visitShop}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/tile:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
