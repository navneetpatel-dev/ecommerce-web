"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { CharacterCount } from "@/shared/components/forms/CharacterCount.component";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import type { QnaEditDialogState } from "../../hooks/edit/useQnaEditing.hook";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** Edit a question or an answer; same limits and counter as posting. */
export function EditPostDialog({ state }: { state: QnaEditDialogState }) {
  const countId = `${state.fieldId}-count`;

  return (
    <Dialog open={state.open} onOpenChange={state.onOpenChange}>
      <DialogContent className={styles.editDialog}>
        <DialogHeader className={styles.editHeader}>
          <DialogTitle>{state.title}</DialogTitle>
          <DialogDescription>{LABELS.editRemoderationHint}</DialogDescription>
        </DialogHeader>
        <form onSubmit={state.onSubmit} className={styles.editForm}>
          <label htmlFor={state.fieldId} className={styles.answerFormLabel}>
            {state.label}
          </label>
          <Textarea
            id={state.fieldId}
            value={state.draft}
            onChange={state.onDraftChange}
            rows={4}
            maxLength={state.limits.max}
            aria-describedby={countId}
          />
          <CharacterCount
            id={countId}
            value={state.draft}
            limits={state.limits}
          />
          <FormError error={state.error} fallback={LABELS.couldNotSaveEdit} />
          <div className={styles.editActions}>
            <Button type="button" variant="ghost" onClick={state.onCancel}>
              {LABELS.cancel}
            </Button>
            <Button
              type="submit"
              loading={state.isPending}
              disabled={!state.canSave}
            >
              {LABELS.saveChanges}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
