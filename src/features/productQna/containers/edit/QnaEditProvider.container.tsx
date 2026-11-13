"use client";

import type { ReactNode } from "react";
import { QnaEditContext } from "../../context/qnaEdit.context";
import { useQnaEditing } from "../../hooks/edit/useQnaEditing.hook";
import { EditPostDialog } from "../../components/edit/EditPostDialog.component";

/** Lets the shopper edit their own questions/answers anywhere below it; one dialog. */
export function QnaEditProvider({ children }: { children: ReactNode }) {
  const editing = useQnaEditing();

  return (
    <QnaEditContext.Provider value={editing.actions}>
      {children}
      <EditPostDialog state={editing.dialog} />
    </QnaEditContext.Provider>
  );
}
