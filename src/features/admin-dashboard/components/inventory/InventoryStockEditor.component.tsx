"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Package, Save } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { useInventoryStockEditor } from "../../hooks/inventory/useInventoryStockEditor.hook";
import type { LowStockInventoryRow } from "../../api/inventory/inventory.api";

interface InventoryStockEditorProps {
  row: LowStockInventoryRow;
  reload: () => void;
}

export function InventoryStockEditor({
  row,
  reload,
}: InventoryStockEditorProps) {
  const [open, setOpen] = useState(false);
  const { stock, setStock, pending, error, save } = useInventoryStockEditor(
    row.stock,
    row.id,
  );

  const handleStockChange = (event: ChangeEvent<HTMLInputElement>) =>
    setStock(event.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, ""));

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    await save(reload);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
        >
          <Package className="size-3.5" aria-hidden />
          <span>{LABELS.editStock}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>{LABELS.updateStock}</DialogTitle>
            <DialogDescription>
              {row.productName} ({row.sku})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FormFieldFrame
              label={LABELS.stock}
              htmlFor={`stock-input-${row.id}`}
            >
              <Input
                id={`stock-input-${row.id}`}
                type="text"
                inputMode="numeric"
                value={stock}
                onChange={handleStockChange}
                placeholder={String(row.stock)}
              />
            </FormFieldFrame>

            {error ? (
              <p
                role="alert"
                className="text-body-xs font-medium text-destructive"
              >
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              {LABELS.cancel}
            </Button>
            <Button type="submit" size="sm" loading={pending}>
              <Save className="size-3.5" aria-hidden />
              <span>{LABELS.save}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
