"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/shared/utils/dom/cn";
import { sliderStyles } from "../../styles/ui/slider.styles";

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderStyles.root, className)}
    {...props}
  >
    <SliderPrimitive.Track className={sliderStyles.track}>
      <SliderPrimitive.Range className={sliderStyles.range} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={sliderStyles.thumb} />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider };
