import { Undo2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { rtoHandoverCardStyles as styles } from "../../styles/rto/rtoHandoverCard.styles";

interface RtoHandoverCardProps {
  otpCode: string;
  onOtpCodeChange: (code: string) => void;
  onConfirm: () => void;
  confirmPending: boolean;
  requestCodePending: boolean;
  requestCodeSuccess: boolean;
  expiresInMinutes?: number;
  onRequestCode: () => void;
}

/** Vendor hub handover acknowledgment for an RTO parcel — mirrors the customer doorstep OTP flow. */
export function RtoHandoverCard({
  otpCode,
  onOtpCodeChange,
  onConfirm,
  confirmPending,
  requestCodePending,
  requestCodeSuccess,
  expiresInMinutes,
  onRequestCode,
}: RtoHandoverCardProps) {
  const codeSentNotice =
    requestCodeSuccess && expiresInMinutes ? (
      <p className={styles.noticeText}>
        Code sent to the vendor. Expires in {expiresInMinutes} minutes.
      </p>
    ) : null;
  const otpDigitCount = otpCode.length;
  const confirmDisabled = otpCode.length !== 6;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Undo2 className={styles.icon} aria-hidden="true" />
          <TextEyebrow className={styles.eyebrow}>Return to Origin</TextEyebrow>
        </div>
        <span className={styles.badge}>Vendor Handover</span>
      </div>

      <div className={styles.body}>
        <div>
          <h2 className={styles.title}>Hand this parcel back to the seller</h2>
          <p className={styles.subtitle}>
            Delivery failed after 3 attempts. Ask the vendor for the handover
            code they received by email to confirm they&apos;ve received the
            parcel back.
          </p>
        </div>

        <div className={styles.codeSection}>
          <div className={styles.codeHeader}>
            <label className={styles.label}>Vendor Handover Code</label>
            <Button
              variant="outline"
              size="sm"
              loading={requestCodePending}
              onClick={onRequestCode}
            >
              Send handover code
            </Button>
          </div>
          {codeSentNotice}
          <div className={styles.inputRow}>
            <Input
              inputMode="numeric"
              maxLength={6}
              value={otpCode}
              placeholder="------"
              className={styles.input}
              onChange={(e) =>
                onOtpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
            <span className={styles.digitCount}>{otpDigitCount}/6 digits</span>
          </div>
        </div>

        <Button
          className={styles.submitButton}
          size="lg"
          disabled={confirmDisabled}
          loading={confirmPending}
          onClick={onConfirm}
        >
          Confirm handover
        </Button>
      </div>
    </div>
  );
}
