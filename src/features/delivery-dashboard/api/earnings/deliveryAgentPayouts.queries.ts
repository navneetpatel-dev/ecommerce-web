"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryAgentApi } from "../agent/deliveryAgent.api";
import { deliveryKeys } from "../agent/deliveryAgent.keys";
import type { BankDetails } from "../../types/agent/types";

export function useMyCashDeposits() {
  return useQuery({
    queryKey: deliveryKeys.cashDeposits,
    queryFn: () => deliveryAgentApi.myCashDeposits(),
  });
}
export function useCloseCashShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { amount: number; note?: string }) =>
      deliveryAgentApi.closeCashShift(input.amount, input.note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deliveryKeys.shiftSummary });
      queryClient.invalidateQueries({ queryKey: deliveryKeys.cashDeposits });
    },
  });
}
export function useMyPayouts() {
  return useQuery({
    queryKey: deliveryKeys.payouts,
    queryFn: () => deliveryAgentApi.myPayouts(),
  });
}
export function useMyEarningsLedger() {
  return useQuery({
    queryKey: deliveryKeys.earnings,
    queryFn: () => deliveryAgentApi.myEarningsLedger(),
  });
}
export function useUpdateBankDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bankDetails: BankDetails) =>
      deliveryAgentApi.updateBankDetails(bankDetails),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: deliveryKeys.profile }),
  });
}
