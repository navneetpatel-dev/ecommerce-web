import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  FileCode2,
} from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { documentViewerStyles } from "../../styles/badges/badgeComponents.styles";

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
      badgeStyle: documentViewerStyles.variants.pdf,
    },
    docx: {
      label: LABELS.previewDocx,
      tag: "DOCX",
      icon: FileCode2,
      badgeStyle: documentViewerStyles.variants.docx,
    },
    image: {
      label: LABELS.previewImage,
      tag: "IMG",
      icon: ImageIcon,
      badgeStyle: documentViewerStyles.variants.image,
    },
    generic: {
      label: LABELS.previewDocument,
      tag: "DOC",
      icon: FileText,
      badgeStyle: documentViewerStyles.variants.generic,
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
      className={cn(documentViewerStyles.button, className)}
    >
      <span className={cn(documentViewerStyles.badgeTag, config.badgeStyle)}>
        <Icon className={documentViewerStyles.icon} aria-hidden />
      </span>
      <span className={documentViewerStyles.labelText}>{config.label}</span>
      <ExternalLink className={documentViewerStyles.externalIcon} aria-hidden />
    </button>
  );
}
