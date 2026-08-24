import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  FileCode2,
} from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

export type DocumentFormatType = "pdf" | "docx" | "image" | "generic";

export function detectDocumentFormat(url?: string | null): DocumentFormatType {
  if (!url) return "generic";
  if (/\.pdf($|\?)/i.test(url)) return "pdf";
  if (/\.(docx?|odt|rtf)($|\?)/i.test(url)) return "docx";
  if (/\.(png|jpe?g|webp|gif|svg|avif)($|\?)/i.test(url)) return "image";
  return "generic";
}

interface DocumentViewerBadgeProps {
  url?: string | null;
  onOpen: () => void;
  disabled?: boolean;
  className?: string;
}

export function DocumentViewerBadge({
  url,
  onOpen,
  disabled = false,
  className,
}: DocumentViewerBadgeProps) {
  const format = detectDocumentFormat(url);

  const config = {
    pdf: {
      label: LABELS.previewPdf,
      tag: "PDF",
      icon: FileText,
      badgeStyle: "bg-danger-subtle text-danger border-danger/30",
    },
    docx: {
      label: LABELS.previewDocx,
      tag: "DOCX",
      icon: FileCode2,
      badgeStyle: "bg-brand-subtle text-brand border-brand/30",
    },
    image: {
      label: LABELS.previewImage,
      tag: "IMG",
      icon: ImageIcon,
      badgeStyle: "bg-accent-subtle text-accent border-accent/30",
    },
    generic: {
      label: LABELS.previewDocument,
      tag: "DOC",
      icon: FileText,
      badgeStyle: "bg-line/40 text-ink-muted border-line-strong",
    },
  }[format];

  const Icon = config.icon;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      title={LABELS.openInNewTab}
      className={cn(
        "group/viewer inline-flex h-7.5 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-xs font-semibold text-ink transition-all hover:border-brand/70 hover:bg-surface-raised hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-4.5 items-center justify-center rounded-full border text-[8px] font-bold tracking-tight",
          config.badgeStyle,
        )}
      >
        <Icon className="size-2.5 shrink-0" aria-hidden />
      </span>
      <span className="font-semibold text-ink group-hover/viewer:text-brand transition-colors whitespace-nowrap">
        {config.label}
      </span>
      <ExternalLink
        className="size-3 text-ink-muted group-hover/viewer:text-brand transition-colors shrink-0 ml-0.5"
        aria-hidden
      />
    </button>
  );
}
