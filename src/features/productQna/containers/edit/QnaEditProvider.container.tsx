"use client";

import type { ReactNode } from "react";
import { ConfirmDeleteDialog } from "@/shared/components/dialogs/ConfirmDeleteDialog.component";
import { QnaEditContext } from "../../context/qnaEdit.context";
import { useQnaEditing } from "../../hooks/edit/useQnaEditing.hook";
import { useQnaDeleting } from "../../hooks/edit/useQnaDeleting.hook";
import { EditPostDialog } from "../../components/edit/EditPostDialog.component";

/** Lets the shopper edit or delete their own questions/answers anywhere below it. */
export function QnaEditProvider({ children }: { children: ReactNode }) {
  const editing = useQnaEditing();
  const deleting = useQnaDeleting();

  return (
    <QnaEditContext.Provider
      value={{
        ...editing.actions,
        deleteQuestion: deleting.deleteQuestion,
        deleteAnswer: deleting.deleteAnswer,
      }}
    >
      {children}
      <EditPostDialog state={editing.dialog} />
      <ConfirmDeleteDialog
        open={deleting.dialog.open}
        title={deleting.dialog.title}
        description={deleting.dialog.description}
        isPending={deleting.dialog.isPending}
        onConfirm={deleting.dialog.onConfirm}
        onOpenChange={deleting.dialog.onOpenChange}
      />
    </QnaEditContext.Provider>
  );
}
