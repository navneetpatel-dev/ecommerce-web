"use client";

import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface TableRowActionProps {
  children: ReactNode;
  /** When true, action is sorted last (destructive / reject / delete). */
  destructive?: boolean;
}

/** Optional wrapper to mark an action as destructive for sort order inside `TableRowActions`. */
export function TableRowAction({ destructive, children }: TableRowActionProps) {
  return (
    <span
      className="block w-full min-w-0"
      data-table-row-menu-item
      data-table-action-destructive={destructive ? true : undefined}
    >
      {children}
    </span>
  );
}

interface TableRowActionsProps {
  children: ReactNode;
  className?: string;
  menuClassName?: string;
}

function componentDisplayName(type: unknown): string {
  if (typeof type !== "function" && typeof type !== "object") return "";
  const named = type as { displayName?: string; name?: string };
  return named.displayName ?? named.name ?? "";
}

/** Dialogs/portals are not row action controls — exclude from the kebab menu list. */
function isNonActionSlot(node: ReactNode): boolean {
  if (!isValidElement(node)) return false;
  if (typeof node.type === "string") return false;
  const name = componentDisplayName(node.type);
  return /Dialog|Modal|Portal|TooltipProvider/i.test(name);
}

function flattenActionNodes(nodes: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(nodes, (child) => {
    if (child == null || typeof child === "boolean") return;
    if (isNonActionSlot(child)) return;

    if (isValidElement(child) && child.type === Fragment) {
      out.push(
        ...flattenActionNodes(
          (child as ReactElement<{ children?: ReactNode }>).props.children,
        ),
      );
      return;
    }

    out.push(child);
  });
  return out;
}

function isOpaqueActionWrapper(node: ReactNode): boolean {
  if (!isValidElement(node)) return false;
  if (node.type === Fragment) return false;
  if (typeof node.type === "string") return false;
  return !isNonActionSlot(node);
}

function isDestructiveAction(node: ReactNode): boolean {
  if (!isValidElement(node)) return false;

  const props = node.props as Record<string, unknown>;

  if (props["data-table-action-destructive"] === true) return true;
  if (props.tone === "danger" || props.dialogVariant === "danger") return true;
  if (props.variant === "destructive") return true;

  const className = props.className;
  if (typeof className === "string" && className.includes("bg-danger"))
    return true;

  if (node.type === Fragment) {
    return flattenActionNodes(props.children as ReactNode).some(
      isDestructiveAction,
    );
  }

  return false;
}

function sortActions(items: ReactNode[]): ReactNode[] {
  const neutral: ReactNode[] = [];
  const destructive: ReactNode[] = [];

  for (const item of items) {
    if (isDestructiveAction(item)) {
      destructive.push(item);
    } else {
      neutral.push(item);
    }
  }

  return [...neutral, ...destructive];
}

function resolveMenuItems(children: ReactNode): ReactNode[] {
  const wrappedInSingleComponent =
    Children.count(children) === 1 && isOpaqueActionWrapper(children);

  if (wrappedInSingleComponent) {
    return Children.toArray(children);
  }

  return sortActions(flattenActionNodes(children));
}

/**
 * Row actions always render as a ⋮ kebab menu — never as inline buttons in table cells.
 */
export function TableRowActions({
  children,
  className,
  menuClassName,
}: TableRowActionsProps) {
  const menuItems = resolveMenuItems(children);

  if (menuItems.length === 0) return null;

  const menuItemElements = menuItems.map((item, index) => (
    <div
      key={index}
      className="w-full min-w-0 overflow-hidden border-t border-line/70 first:rounded-t-sm first:border-t-0 last:rounded-b-sm"
    >
      {item}
    </div>
  ));

  return (
    <div className={cn("flex shrink-0 items-center justify-end", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 w-8 shrink-0 p-0 text-ink-muted hover:text-ink [&_svg]:size-4"
            aria-label={LABELS.moreActions}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className={cn(
            "z-[80] w-[12.5rem] overflow-hidden rounded-sm! p-0",
            "[&_button]:w-full [&_button]:min-w-0 [&_button]:justify-start [&_button]:rounded-none! [&_button]:border-transparent [&_button]:shadow-none",
            "[&_a]:w-full [&_a]:min-w-0 [&_a]:justify-start [&_a]:rounded-none! [&_a]:border-transparent [&_a]:shadow-none [&_a]:inline-flex [&_a]:items-center",
            menuClassName,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {menuItemElements}
        </PopoverContent>
      </Popover>
    </div>
  );
}
