"use client";

import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import type { ExportFileFormat } from "../hooks/useReportHubHelpers/index";
import { exportButtonDisableHint } from "../utils/exportDisableHint";

type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm";
type ButtonFullWidth = boolean | "mobile";

interface ReportExportButtonsProps {
  controlsDisabled: boolean;
  exportingFormat?: ExportFileFormat | null;
  locked?: boolean;
  statusMessage?: string | null;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  size?: ButtonSize;
  fullWidth?: ButtonFullWidth;
  /** Extra disable guard (e.g. !reportType). Applied in addition to controlsDisabled. */
  disabled?: boolean;
  blockedHint?: string;
  /** When false, render buttons only (for composing inside an existing ButtonGroup). */
  grouped?: boolean;
}

function ExportButton({
  format,
  label,
  loading,
  exportDisabled,
  hint,
  size,
  fullWidth,
  onClick,
}: {
  format: ExportFileFormat;
  label: string;
  loading: boolean;
  exportDisabled: boolean;
  hint: string;
  size?: ButtonSize;
  fullWidth?: ButtonFullWidth;
  onClick: () => void;
}) {
  return (
    <DisabledActionHint
      disabled={exportDisabled}
      message={hint}
      block
      className={cn(
        fullWidth === true && "w-full",
        fullWidth === "mobile" && "w-full sm:w-auto",
      )}
    >
      <Button
        type="button"
        variant="outline"
        size={size}
        fullWidth={fullWidth}
        loading={loading}
        disabled={exportDisabled}
        onClick={onClick}
      >
        {label}
      </Button>
    </DisabledActionHint>
  );
}

export function ReportExportButtons({
  controlsDisabled,
  exportingFormat = null,
  locked = false,
  statusMessage = null,
  onExportExcel,
  onExportCsv,
  onExportPdf,
  size,
  fullWidth = "mobile",
  disabled = false,
  blockedHint,
  grouped = true,
}: ReportExportButtonsProps) {
  const hintContext = {
    message: statusMessage,
    exportingFormat,
    controlsDisabled,
    locked,
    blocked: disabled,
    blockedHint,
  };

  const buttons = (
    <>
      <ExportButton
        format="xlsx"
        label={LABELS.exportExcel}
        loading={exportingFormat === "xlsx"}
        exportDisabled={controlsDisabled || disabled}
        hint={exportButtonDisableHint({ ...hintContext, format: "xlsx" })}
        size={size}
        fullWidth={fullWidth}
        onClick={onExportExcel}
      />
      <ExportButton
        format="csv"
        label={LABELS.exportCsv}
        loading={exportingFormat === "csv"}
        exportDisabled={controlsDisabled || disabled}
        hint={exportButtonDisableHint({ ...hintContext, format: "csv" })}
        size={size}
        fullWidth={fullWidth}
        onClick={onExportCsv}
      />
      <ExportButton
        format="pdf"
        label={LABELS.exportPdf}
        loading={exportingFormat === "pdf"}
        exportDisabled={controlsDisabled || disabled}
        hint={exportButtonDisableHint({ ...hintContext, format: "pdf" })}
        size={size}
        fullWidth={fullWidth}
        onClick={onExportPdf}
      />
    </>
  );

  if (!grouped) return buttons;

  return <ButtonGroup align="start">{buttons}</ButtonGroup>;
}
