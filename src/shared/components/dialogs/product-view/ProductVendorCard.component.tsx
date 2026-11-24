"use client";

import { Store, ExternalLink, ShieldCheck } from "lucide-react";
import { PATHS } from "@/shared/constants/paths/paths";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";
import { ProductVendorContactGrid } from "./ProductVendorContactGrid.component";

interface ProductVendorCardProps {
  product: Record<string, unknown>;
}

export function ProductVendorCard({ product }: ProductVendorCardProps) {
  const vendor = (product.vendor as Record<string, unknown>) ?? null;
  const vendorId =
    typeof vendor?.id === "string"
      ? vendor.id
      : typeof product.vendorId === "string"
        ? product.vendorId
        : null;

  const vendorName =
    typeof vendor?.businessName === "string"
      ? vendor.businessName
      : typeof product.vendorName === "string"
        ? product.vendorName
        : null;

  const vendorSlug =
    typeof vendor?.slug === "string"
      ? vendor.slug
      : typeof product.vendorSlug === "string"
        ? product.vendorSlug
        : null;

  const status = typeof vendor?.status === "string" ? vendor.status : null;
  const kycComplete = vendor?.kycComplete === true;

  if (!vendorName && !vendorId) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line/60 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-ink font-semibold text-body-sm">
          <Store className="size-4 text-brand" aria-hidden />
          <span>Vendor & Merchant Details</span>
        </div>

        <div className="flex items-center gap-2">
          {status && <StatusBadge status={status} />}
          {vendorId && (
            <a
              href={`/admin/vendors/${vendorId}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open vendor admin profile in new tab"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-line bg-paper text-ink text-xs font-semibold hover:border-brand/50 hover:text-brand transition-colors"
            >
              <span>Admin Profile</span>
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-line/60 bg-paper/60">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {vendorSlug ? (
              <a
                href={PATHS.vendorPage(vendorSlug)}
                target="_blank"
                rel="noopener noreferrer"
                title="Open merchant storefront in new tab"
                className="font-bold text-base text-ink hover:text-brand hover:underline inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{vendorName ?? "Seller"}</span>
                <ExternalLink className="size-3.5 opacity-60" />
              </a>
            ) : (
              <span className="font-bold text-base text-ink">
                {vendorName ?? "Seller"}
              </span>
            )}
            {kycComplete && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold border border-emerald-500/20">
                <ShieldCheck className="size-3 text-emerald-600" />
                KYC Verified
              </span>
            )}
          </div>
          {vendorSlug && (
            <div className="flex items-center gap-1.5 font-mono text-xs text-ink-muted pt-0.5">
              <span>@{vendorSlug}</span>
              <RecordDetailCopyButton
                value={vendorSlug}
                label="Copy seller slug"
              />
            </div>
          )}
        </div>

        {vendorSlug && (
          <a
            href={PATHS.vendorPage(vendorSlug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline shrink-0"
          >
            <span>Visit Storefront</span>
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      <ProductVendorContactGrid
        email={typeof vendor?.email === "string" ? vendor.email : null}
        phone={typeof vendor?.phone === "string" ? vendor.phone : null}
        commissionRate={vendor?.commissionRate ?? product.vendorCommissionRate}
        gstNumber={
          typeof vendor?.gstNumber === "string" ? vendor.gstNumber : null
        }
        panNumber={
          typeof vendor?.panNumber === "string" ? vendor.panNumber : null
        }
        state={typeof vendor?.state === "string" ? vendor.state : null}
        performanceScore={vendor?.performanceScore}
        payoutFrequency={
          typeof vendor?.payoutFrequency === "string"
            ? vendor.payoutFrequency
            : null
        }
        entityType={
          typeof vendor?.entityType === "string" ? vendor.entityType : null
        }
      />
    </div>
  );
}
