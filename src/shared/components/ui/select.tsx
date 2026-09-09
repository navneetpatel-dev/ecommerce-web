"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { selectStyles } from "../../styles/ui/select.styles";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectStyles.trigger, className)}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown size={16} className={selectStyles.triggerIcon} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      position = "popper",
      onCloseAutoFocus,
      onPointerDownOutside,
      onPointerDown,
      ...props
    },
    ref,
  ) => {
    const closedByPointerRef = React.useRef(false);

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            selectStyles.content,
            position === "popper" && selectStyles.popperContent,
            className,
          )}
          position={position}
          onPointerDown={(event) => {
            // Item / list interaction via mouse/touch — avoid sticky focus ring on trigger.
            if (
              event.pointerType === "mouse" ||
              event.pointerType === "touch" ||
              event.pointerType === "pen"
            ) {
              closedByPointerRef.current = true;
            }
            onPointerDown?.(event);
          }}
          onPointerDownOutside={(event) => {
            closedByPointerRef.current = true;
            onPointerDownOutside?.(event);
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            if (event.defaultPrevented) return;
            if (closedByPointerRef.current) {
              event.preventDefault();
            }
            closedByPointerRef.current = false;
          }}
          {...props}
        >
          <SelectPrimitive.Viewport
            className={cn(
              selectStyles.viewport,
              position === "popper" && selectStyles.popperViewport,
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectStyles.item, className)}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className={selectStyles.indicatorWrapper}>
      <SelectPrimitive.ItemIndicator>
        <Check size={16} className={selectStyles.indicatorIcon} />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
