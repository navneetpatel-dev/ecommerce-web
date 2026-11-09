"use client";

import { Pencil, Plus } from "lucide-react";
import type { CashbackOffer } from "@/features/cashback";
import { FormError } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { useCashbackOfferDialog } from "../../hooks/cashback-offers/useCashbackOfferDialog.hook";
import { adminCashbackOffersStyles as styles } from "../../styles/cashback-offers/adminCashbackOffers.styles";
import { CashbackOfferFormFields } from "./CashbackOfferFormFields.component";

interface CashbackOfferDialogProps {
  /** Omit to create a new offer. */
  offer?: CashbackOffer | null;
}

/** "New offer" button, or a row's "Edit", opening the offer form. */
export function CashbackOfferDialog({
  offer = null,
}: CashbackOfferDialogProps) {
  const dialog = useCashbackOfferDialog(offer);

  return (
    <Dialog open={dialog.open} onOpenChange={dialog.setOpen}>
      {offer ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={dialog.handleOpen}
        >
          <Pencil strokeWidth={2.25} aria-hidden />
          <span>{LABELS.cashbackOfferEdit}</span>
        </Button>
      ) : (
        <Button type="button" onClick={dialog.handleOpen}>
          <Plus aria-hidden />
          <span>{LABELS.cashbackOfferNew}</span>
        </Button>
      )}
      <DialogContent
        className={styles.dialogContent}
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={dialog.onSubmit} className={styles.form} noValidate>
          <CashbackOfferFormFields form={dialog.form} />
          <FormError
            error={dialog.formLevelError}
            fallback={LABELS.genericActionFailed}
          />
          <div className={styles.actions}>
            <Button
              type="submit"
              loading={dialog.isPending}
              disabled={dialog.isPending}
            >
              {LABELS.cashbackOfferSave}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
