"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/shared/utils/dom/cn";
import { radioGroupStyles } from "../../styles/ui/radio-group.styles";

const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn(radioGroupStyles.root, className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioGroupStyles.item, className)}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className={radioGroupStyles.indicator}>
      <div className={radioGroupStyles.dot} />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
