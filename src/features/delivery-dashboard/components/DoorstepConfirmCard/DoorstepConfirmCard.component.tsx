"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { doorstepConfirmCardStyles } from "./doorstepConfirmCard.styles";
import { useDoorstepConfirmHandlers } from "./useDoorstepConfirmHandlers.hook";
import { DoorstepPasscodeSection } from "./DoorstepPasscodeSection.component";
import { DoorstepProofSection } from "./DoorstepProofSection.component";
import { DoorstepCodSection } from "./DoorstepCodSection.component";

export interface DoorstepConfirmCardProps {
  otpCode: string;
  onOtpCodeChange: (code: string) => void;
  proof: File | null;
  onProofChange: (file: File | null) => void;
  onConfirm: () => void;
  confirmPending: boolean;
  requestCodePending: boolean;
  requestCodeSuccess: boolean;
  expiresInMinutes?: number;
  onRequestCode: () => void;
  codAmount?: number | null;
  codCollected?: boolean;
  onCodCollectedChange?: (collected: boolean) => void;
}

export function DoorstepConfirmCard({
  otpCode,
  onOtpCodeChange,
  proof,
  onProofChange,
  onConfirm,
  confirmPending,
  requestCodePending,
  requestCodeSuccess,
  expiresInMinutes,
  onRequestCode,
  codAmount,
  codCollected = false,
  onCodCollectedChange,
}: DoorstepConfirmCardProps) {
  const isCod = codAmount != null;
  const canSubmit = otpCode.length === 6 && (!isCod || codCollected);

  const {
    handleOtpInputChange,
    handleProofInputChange,
    handleCodCollectedChange,
  } = useDoorstepConfirmHandlers({
    onOtpCodeChange,
    onProofChange,
    onCodCollectedChange,
  });

  return (
    <div className={doorstepConfirmCardStyles.container}>
      <div className={doorstepConfirmCardStyles.header}>
        <div className="flex items-center gap-2">
          <ShieldCheck
            className={doorstepConfirmCardStyles.headerIcon}
            aria-hidden="true"
          />
          <TextEyebrow className={doorstepConfirmCardStyles.headerEyebrow}>
            Doorstep Verification
          </TextEyebrow>
        </div>
        <span className={doorstepConfirmCardStyles.headerBadge}>
          Final Step
        </span>
      </div>

      <div className={doorstepConfirmCardStyles.body}>
        <div>
          <h2 className={doorstepConfirmCardStyles.title}>
            Confirm at the doorstep
          </h2>
          <p className={doorstepConfirmCardStyles.subtitle}>
            Enter the customer&apos;s six-digit passcode to verify package
            handover.
          </p>
        </div>

        <DoorstepPasscodeSection
          otpCode={otpCode}
          requestCodePending={requestCodePending}
          requestCodeSuccess={requestCodeSuccess}
          expiresInMinutes={expiresInMinutes}
          onRequestCode={onRequestCode}
          onOtpInputChange={handleOtpInputChange}
        />

        <DoorstepProofSection
          proof={proof}
          onProofInputChange={handleProofInputChange}
        />

        {isCod && codAmount != null ? (
          <DoorstepCodSection
            codAmount={codAmount}
            codCollected={codCollected}
            onCodCollectedChange={handleCodCollectedChange}
          />
        ) : null}

        <Button
          className={doorstepConfirmCardStyles.submitButton}
          size="lg"
          disabled={!canSubmit}
          loading={confirmPending}
          onClick={onConfirm}
        >
          Confirm delivered
        </Button>
      </div>
    </div>
  );
}
