import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import { CheckIcon, ChevronDownIcon } from './icons';

type SelectProps = SelectPrimitive.SelectProps & {
  className?: string;
  placeholder?: React.ReactNode;
};

export function Select({ value, onValueChange, children, placeholder, className }: SelectProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
      <SelectPrimitive.Trigger
        className={`inline-flex h-10 w-full items-center justify-between rounded-md border border-subtle bg-white px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 ${className ?? ''}`}
        aria-label="선택"
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDownIcon />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="z-50 min-w-40 overflow-hidden rounded-md border border-subtle bg-white shadow-lg"
          position="popper"
          sideOffset={6}
        >
          <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

type SelectItemProps = SelectPrimitive.SelectItemProps & {
  className?: string;
};

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={`relative flex cursor-pointer select-none items-center gap-2 rounded px-3 py-2 text-sm text-foreground outline-none focus:bg-(--border) ${className ?? ''}`}
      {...props}
    >
      <SelectPrimitive.ItemIndicator>
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  ),
);

SelectItem.displayName = 'SelectItem';
