"use client";

import type { RefObject } from "react";
import { CheckCircle2, PenLine } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type { WriteReviewPanelState } from "../../hooks/write-review/useWriteReviewPanel.hook";
import { ReviewFormContainer } from "../../containers/review-form/ReviewFormContainer.container";
import { writeReviewPanelStyles as styles } from "../../styles/review-form/writeReviewPanel.styles";

interface WriteReviewPanelProps {
  state: WriteReviewPanelState;
  panelRef: RefObject<HTMLDivElement | null>;
  productId: string;
  productName: string;
}

/** Top of the Reviews tab: invite → inline form → thanks. Only for eligible buyers. */
export function WriteReviewPanel({
  state,
  panelRef,
  productId,
  productName,
}: WriteReviewPanelProps) {
  if (state.submitted) {
    return (
      <p role="status" className={styles.thanks}>
        <CheckCircle2 className={styles.thanksIcon} aria-hidden />
        {LABELS.writeReviewPanelThanks}
      </p>
    );
  }
  if (!state.orderItemId) return null;

  return (
    <section
      id="write-review"
      ref={panelRef}
      aria-label={LABELS.writeAReview}
      className={cn(styles.panel, state.highlighted && styles.highlighted)}
    >
      <div className={styles.header}>
        <span className={styles.iconWrap} aria-hidden>
          <PenLine className={styles.icon} />
        </span>
        <div className={styles.text}>
          <h3 className={styles.title}>{LABELS.writeReviewPanelTitle}</h3>
          <p className={styles.body}>{LABELS.writeReviewPanelBody}</p>
        </div>
        <Button
          type="button"
          variant={state.open ? "ghost" : "default"}
          className={styles.toggle}
          aria-expanded={state.open}
          aria-controls="write-review-form"
          onClick={state.toggle}
        >
          {state.open ? LABELS.hideReviewForm : LABELS.writeAReview}
        </Button>
      </div>
      {state.open ? (
        <div id="write-review-form" className={styles.form}>
          <ReviewFormContainer
            orderItemId={state.orderItemId}
            productId={productId}
            productName={productName}
            onSubmitted={state.handleSubmitted}
          />
        </div>
      ) : null}
    </section>
  );
}
