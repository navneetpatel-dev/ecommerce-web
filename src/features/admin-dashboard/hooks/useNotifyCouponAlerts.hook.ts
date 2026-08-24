"use client";

import { useMutation } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";

export function useNotifyCouponAlerts() {
  return useMutation({
    mutationFn: () => adminApi.notifyCouponAlerts(),
  });
}
