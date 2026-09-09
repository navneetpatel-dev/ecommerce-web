import {
  PANEL_ELEVATED,
  PANEL_HEADER_COMPACT,
  FLEX_BETWEEN_GAP_2,
  FLEX_CENTER_GAP_2,
  FLEX_CENTER_GAP_3,
  TEXT_MUTED_SM,
  TEXT_SUCCESS_SM,
} from "@/shared/styles/common.styles";

export const pickupChecklistCardStyles = {
  card: PANEL_ELEVATED,
  header: `${FLEX_BETWEEN_GAP_2} ${PANEL_HEADER_COMPACT}`,
  headerLeft: FLEX_CENTER_GAP_2,
  headerIcon: "size-4 text-brand",
  eyebrow: "!mb-0",
  exchangeBadge: "text-caption font-medium uppercase tracking-wider text-brand",
  body: "space-y-5 p-5 md:p-6",
  title: "font-display text-[1.125rem] font-medium text-ink",
  subtitle: TEXT_MUTED_SM,
  codeBox: "rounded-lg border border-line bg-paper/40 p-4 space-y-3",
  codeLabelRow: "flex flex-wrap items-center justify-between gap-2",
  codeLabel: "text-body-sm font-medium text-ink",
  codeSuccessText: TEXT_SUCCESS_SM,
  codeInputsRow: FLEX_CENTER_GAP_3,
  otpInput:
    "max-w-[180px] text-center font-mono text-xl tracking-[0.25em] font-semibold",
  digitsCount: "text-caption text-ink-muted",
  uploadSection: "space-y-3",
  dropzone:
    "rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40",
  dropzoneLabel:
    "flex cursor-pointer flex-col items-center justify-center gap-2 text-center",
  uploadIconCircle:
    "flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand",
  uploadIcon: "size-4",
  dropzoneText: "text-body-sm font-medium text-ink",
  submitButton: "w-full",
} as const;
