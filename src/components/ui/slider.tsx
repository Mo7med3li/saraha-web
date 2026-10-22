"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "cn";

export interface SliderProps extends Omit<
  SliderPrimitive.Root.Props,
  "onValueChange" | "value" | "defaultValue"
> {
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      defaultValue,
      value,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    // Normalize value to array for rendering thumb indicators
    const normalizedValue = Array.isArray(value)
      ? value
      : typeof value === "number"
        ? [value]
        : undefined;

    const normalizedDefaultValue = Array.isArray(defaultValue)
      ? defaultValue
      : typeof defaultValue === "number"
        ? [defaultValue]
        : [min];

    const currentValues = normalizedValue ?? normalizedDefaultValue;

    const handleValueChange = (val: number | number[]) => {
      const arr = Array.isArray(val) ? val : [val];
      onValueChange?.(arr);
    };

    return (
      <SliderPrimitive.Root
        ref={ref}
        data-slot="slider"
        className={cn(
          "relative flex w-full touch-none select-none items-center py-2",
          className,
        )}
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Control className="relative flex w-full items-center select-none">
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted/80 shadow-inner cursor-pointer"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="absolute h-full bg-primary transition-all rounded-full"
            />
          </SliderPrimitive.Track>
          {currentValues.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              data-slot="slider-thumb"
              className="block size-4.5 shrink-0 rounded-full border-2 border-primary bg-background shadow-md transition-transform hover:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = "Slider";

export { Slider };
