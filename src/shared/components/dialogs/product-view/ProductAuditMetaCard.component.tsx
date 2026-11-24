"use client";

import {
  AlertTriangle,
  Clock,
  Search,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";
import { tryFormatDateTime } from "@/shared/utils/formatting/formatDate";

interface ProductAuditMetaCardProps {
  product: Record<string, unknown>;
}

export function ProductAuditMetaCard({ product }: ProductAuditMetaCardProps) {
  const rejectionReason =
    typeof product.rejectionReason === "string"
      ? product.rejectionReason
      : null;
  const moderationNotes =
    typeof product.moderationNotes === "string"
      ? product.moderationNotes
      : null;
  const createdAt = product.createdAt
    ? tryFormatDateTime(product.createdAt)
    : null;
  const updatedAt = product.updatedAt
    ? tryFormatDateTime(product.updatedAt)
    : null;
  const publishedAt = product.publishedAt
    ? tryFormatDateTime(product.publishedAt)
    : null;
  const moderatedAt = product.moderatedAt
    ? tryFormatDateTime(product.moderatedAt)
    : null;

  const seoTitle =
    typeof product.seoTitle === "string" ? product.seoTitle : null;
  const seoDescription =
    typeof product.seoDescription === "string" ? product.seoDescription : null;
  const videoUrl =
    typeof product.videoUrl === "string" ? product.videoUrl : null;
  const sizeChartUrl =
    typeof product.sizeChartUrl === "string" ? product.sizeChartUrl : null;

  const hasAnyData =
    Boolean(rejectionReason) ||
    Boolean(moderationNotes) ||
    Boolean(createdAt) ||
    Boolean(updatedAt) ||
    Boolean(seoTitle) ||
    Boolean(videoUrl) ||
    Boolean(sizeChartUrl);

  if (!hasAnyData) return null;

  return (
    <div className="rounded-2xl border border-line/80 bg-surface p-4 sm:p-5 shadow-xs space-y-4">
      {rejectionReason && (
        <div className="p-4 rounded-xl border border-danger/35 bg-danger-subtle space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-danger font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="size-4 shrink-0 text-danger" />
            <span>Rejection Reason / Moderation Notice</span>
          </div>
          <p className="text-sm font-medium text-ink whitespace-pre-line leading-relaxed">
            {rejectionReason}
          </p>
        </div>
      )}

      {moderationNotes && (
        <div className="p-3.5 rounded-xl border border-line/70 bg-paper/60 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            Moderator Notes
          </span>
          <p className="text-xs text-ink/90 whitespace-pre-line">
            {moderationNotes}
          </p>
        </div>
      )}

      {(videoUrl || sizeChartUrl) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
            >
              <Video className="size-3.5 text-brand" />
              <span>Product Video</span>
              <ExternalLink className="size-3 opacity-60" />
            </a>
          )}
          {sizeChartUrl && (
            <a
              href={sizeChartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line-strong/80 bg-surface text-ink text-xs font-semibold hover:border-brand hover:bg-brand-subtle hover:text-brand transition-all shadow-xs"
            >
              <FileText className="size-3.5 text-brand" />
              <span>Size Chart</span>
              <ExternalLink className="size-3 opacity-60" />
            </a>
          )}
        </div>
      )}

      {(seoTitle || seoDescription) && (
        <div className="p-3.5 rounded-xl border border-line/50 bg-paper/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
            <Search className="size-3 text-brand" />
            <span>SEO Search Metadata</span>
          </div>
          {seoTitle && (
            <p className="text-xs font-semibold text-ink">{seoTitle}</p>
          )}
          {seoDescription && (
            <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">
              {seoDescription}
            </p>
          )}
        </div>
      )}

      {(createdAt || updatedAt || publishedAt || moderatedAt) && (
        <div className="flex items-center gap-4 flex-wrap text-[11px] text-ink-muted pt-2 border-t border-line/40">
          <Clock className="size-3.5 text-ink-muted/70 shrink-0" />
          {createdAt && (
            <span>
              Created:{" "}
              <strong className="text-ink font-medium">{createdAt}</strong>
            </span>
          )}
          {updatedAt && (
            <span>
              Updated:{" "}
              <strong className="text-ink font-medium">{updatedAt}</strong>
            </span>
          )}
          {publishedAt && (
            <span>
              Published:{" "}
              <strong className="text-ink font-medium">{publishedAt}</strong>
            </span>
          )}
          {moderatedAt && (
            <span>
              Moderated:{" "}
              <strong className="text-ink font-medium">{moderatedAt}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
