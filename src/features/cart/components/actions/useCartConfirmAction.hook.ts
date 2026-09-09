"use client";

import { useState } from "react";

export function useCartConfirmAction(onConfirm: () => void) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return {
    open,
    setOpen,
    handleOpen,
    handleClose,
    handleConfirm,
  };
}
