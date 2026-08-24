"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VendorRegisterSchema,
  type VendorRegisterInput,
} from "../schemas/vendor.schema";
import { useVendorRegistration } from "./useVendorRegistration.hook";

export function useVendorRegisterPage() {
  const register = useVendorRegistration();
  const form = useForm<VendorRegisterInput>({
    resolver: zodResolver(VendorRegisterSchema),
    defaultValues: {
      businessName: "",
      categoryIds: [],
      description: "",
      gstNumber: "",
      panHolderName: "",
      bankAccountHolderName: "",
    },
  });

  return {
    form,
    error: register.isError,
    isPending: register.isPending,
    onSubmit: (data: VendorRegisterInput) => register.mutate(data),
  };
}
