"use client";

import { useState } from "react";

export function usePasswordVisibility(initial = false) {
  const [visible, setVisible] = useState(initial);

  return {
    visible,
    inputType: visible ? "text" : "password",
    toggle: () => setVisible((value) => !value),
    showLabel: visible ? "Hide password" : "Show password",
  };
}
