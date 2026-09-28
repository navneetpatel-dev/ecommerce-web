"use client";

import { motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { ClearCartAction } from "./ClearCartAction.component";
import { cartPageViewStyles as styles } from "../../../styles/page/cartPageView.styles";

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.2, 0, 0, 1] },
} as const;

export interface CartPageHeaderProps {
  onClearCart: () => void;
  isClearing?: boolean;
  clearDisabled?: boolean;
}

export function CartPageHeader({
  onClearCart,
  isClearing,
  clearDisabled = false,
}: CartPageHeaderProps) {
  return (
    <motion.header
      className={styles.header}
      initial={MOTION_CONFIG.initial}
      animate={MOTION_CONFIG.animate}
      transition={MOTION_CONFIG.transition}
    >
      <div className={styles.headerDetails}>
        <TextEyebrow brand>Shopping bag</TextEyebrow>
        <h1 className={styles.title}>{LABELS.yourCart}</h1>
      </div>
      <ClearCartAction
        onClear={onClearCart}
        isClearing={isClearing}
        disabled={clearDisabled}
      />
    </motion.header>
  );
}
