import { AlertTriangle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface KycRejectionNoticeProps {
  reason: string;
  className?: string;
  showActionHint?: boolean;
}

export function KycRejectionNotice({
  reason,
  className,
  showActionHint = true,
}: KycRejectionNoticeProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-subtle p-3.5 text-xs transition-colors",
        className,
      )}
    >
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
        <AlertTriangle className="size-3.5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-bold text-danger">
          {LABELS.documentRejectionReason}
        </p>
        <p className="font-medium text-ink leading-relaxed break-words">
          {reason}
        </p>
        {showActionHint ? (
          <p className="pt-1 text-[11px] font-semibold text-danger/90">
            {LABELS.rejectionActionHint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
