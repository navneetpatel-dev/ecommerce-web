"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deliveryAgentApi } from "../agent/deliveryAgent.api";
import { deliveryKeys } from "../agent/deliveryAgent.keys";
import type { DeliveryAgentDocumentType } from "../../types/agent/types";

export function useMyDocuments() {
  return useQuery({
    queryKey: deliveryKeys.documents,
    queryFn: () => deliveryAgentApi.myDocuments(),
  });
}
export function useSubmitDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      type: DeliveryAgentDocumentType;
      url: string;
      expiryDate?: string;
    }) =>
      deliveryAgentApi.submitDocument(input.type, input.url, input.expiryDate),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: deliveryKeys.documents }),
  });
}
