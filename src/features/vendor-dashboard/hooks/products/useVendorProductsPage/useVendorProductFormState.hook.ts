"use client";

import { useRouter } from "next/navigation";
import { useProductEditorState } from "@/features/products";

/** The vendor's product form: the shared editor state, refreshing the page after a save. */
export function useVendorProductFormState(options: {
  mode: "create" | "edit" | null;
  editId: string | null;
  close: () => void;
}) {
  const router = useRouter();
  return useProductEditorState({
    ...options,
    onSaved: () => router.refresh(),
  });
}
