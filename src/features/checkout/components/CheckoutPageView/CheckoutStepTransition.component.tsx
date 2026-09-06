"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

interface CheckoutStepTransitionProps {
  stepKey: string;
  children: ReactNode;
}

/** Shared enter/exit animation for each checkout step panel. */
export function CheckoutStepTransition({
  stepKey,
  children,
}: CheckoutStepTransitionProps) {
  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
