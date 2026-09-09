import { AlertTriangle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { kycRejectionNoticeStyles } from "../../styles/notices/noticeComponents.styles";

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
    <div className={cn(kycRejectionNoticeStyles.container, className)}>
      <div className={kycRejectionNoticeStyles.iconWrapper}>
        <AlertTriangle className={kycRejectionNoticeStyles.icon} aria-hidden />
      </div>
      <div className={kycRejectionNoticeStyles.content}>
        <p className={kycRejectionNoticeStyles.title}>
          {LABELS.documentRejectionReason}
        </p>
        <p className={kycRejectionNoticeStyles.reason}>{reason}</p>
        {showActionHint ? (
          <p className={kycRejectionNoticeStyles.actionHint}>
            {LABELS.rejectionActionHint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
