"use client";

import { Children, type ReactNode, type SyntheticEvent } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { useRowActionsMenu } from "../../hooks/data-table/useRowActionsMenu.hook";
import { tableRowActionsStyles } from "../../styles/data-table/dataTableComponents.styles";
import { rowActionsStyles } from "../../styles/data-table/rowActions.styles";
import { RowActionsHost } from "./RowActions/RowActionsHost.component";
import { RowActionsPanel } from "./RowActions/RowActionsPanel.component";
import { RowActionsTrigger } from "./RowActions/RowActionsTrigger.component";

interface TableRowActionsProps {
  /** `RowActionButton`s, or components that render them. */
  children: ReactNode;
  className?: string;
}

const stopRowEvent = (event: SyntheticEvent) => event.stopPropagation();

/**
 * Row actions always render as a ⋮ menu, never as inline buttons in table cells.
 */
export function TableRowActions({ children, className }: TableRowActionsProps) {
  const { triggerRef, ...menu } = useRowActionsMenu();

  if (Children.toArray(children).length === 0) return null;

  return (
    <div className={cn(tableRowActionsStyles.container, className)}>
      <Popover open={menu.open} onOpenChange={menu.handleOpenChange}>
        <PopoverTrigger asChild>
          <RowActionsTrigger
            ref={triggerRef}
            busy={menu.busy}
            onClick={stopRowEvent}
          />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          collisionPadding={12}
          sideOffset={4}
          aria-label={LABELS.moreActions}
          className={rowActionsStyles.panel}
          onClick={stopRowEvent}
          onCloseAutoFocus={menu.handleCloseAutoFocus}
        >
          <RowActionsPanel
            entries={menu.entries}
            onSelect={menu.handleSelect}
          />
        </PopoverContent>
      </Popover>
      {menu.hostMounted ? (
        <RowActionsHost key={menu.session} registry={menu.registry}>
          {children}
        </RowActionsHost>
      ) : null}
      <span role="status" className={rowActionsStyles.status}>
        {menu.busy ? LABELS.rowActionRunning : null}
      </span>
    </div>
  );
}
