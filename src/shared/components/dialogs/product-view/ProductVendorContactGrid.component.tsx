"use client";

import { Mail, Phone, Percent, FileText, MapPin, Award } from "lucide-react";
import { RecordDetailCopyButton } from "../RecordDetailCopyButton.component";

export interface ProductVendorContactGridProps {
  email?: string | null;
  phone?: string | null;
  commissionRate?: unknown;
  gstNumber?: string | null;
  panNumber?: string | null;
  state?: string | null;
  performanceScore?: unknown;
  payoutFrequency?: string | null;
  entityType?: string | null;
}

export function ProductVendorContactGrid({
  email,
  phone,
  commissionRate,
  gstNumber,
  panNumber,
  state,
  performanceScore,
  payoutFrequency,
  entityType,
}: ProductVendorContactGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {email && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <Mail className="size-3" />
            <span>Email</span>
          </div>
          <div className="flex items-center justify-between gap-1 text-xs font-medium text-ink">
            <a
              href={`mailto:${email}`}
              className="truncate hover:text-brand hover:underline"
            >
              {email}
            </a>
            <RecordDetailCopyButton value={email} label="Copy email" />
          </div>
        </div>
      )}

      {phone && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <Phone className="size-3" />
            <span>Phone</span>
          </div>
          <div className="flex items-center justify-between gap-1 text-xs font-medium text-ink">
            <a
              href={`tel:${phone}`}
              className="hover:text-brand hover:underline"
            >
              {phone}
            </a>
            <RecordDetailCopyButton value={phone} label="Copy phone" />
          </div>
        </div>
      )}

      {commissionRate != null && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <Percent className="size-3" />
            <span>Commission</span>
          </div>
          <p className="font-mono font-bold text-xs text-ink">
            {Number(commissionRate)}%
          </p>
        </div>
      )}

      {gstNumber && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <FileText className="size-3" />
            <span>GSTIN</span>
          </div>
          <div className="flex items-center justify-between gap-1 font-mono text-xs text-ink">
            <span>{gstNumber}</span>
            <RecordDetailCopyButton value={gstNumber} label="Copy GSTIN" />
          </div>
        </div>
      )}

      {panNumber && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <FileText className="size-3" />
            <span>PAN</span>
          </div>
          <div className="flex items-center justify-between gap-1 font-mono text-xs text-ink">
            <span>{panNumber}</span>
            <RecordDetailCopyButton value={panNumber} label="Copy PAN" />
          </div>
        </div>
      )}

      {state && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <MapPin className="size-3" />
            <span>Location</span>
          </div>
          <p className="text-xs font-medium text-ink">{state}</p>
        </div>
      )}

      {performanceScore != null && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <Award className="size-3" />
            <span>Performance</span>
          </div>
          <p className="font-mono font-bold text-xs text-ink">
            {Number(performanceScore)} / 100
          </p>
        </div>
      )}

      {payoutFrequency && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Payout Cadence
          </span>
          <p className="text-xs font-medium text-ink capitalize">
            {payoutFrequency.toLowerCase()}
          </p>
        </div>
      )}

      {entityType && (
        <div className="p-3 rounded-xl border border-line/50 bg-paper/40 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Entity Type
          </span>
          <p className="text-xs font-medium text-ink">{entityType}</p>
        </div>
      )}
    </div>
  );
}
