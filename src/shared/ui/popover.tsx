'use client';

import React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';

type PopoverProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  align?: 'center' | 'start' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}>;

export function Popover({ trigger, children, align = 'center', side = 'bottom' }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          side={side}
          sideOffset={8}
          className="z-50 w-64 rounded-lg border border-subtle bg-white p-3 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
