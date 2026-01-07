'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from './icons';

type CheckboxProps = CheckboxPrimitive.CheckboxProps & {
  className?: string;
};

export function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={`h-4 w-4 rounded border border-subtle bg-white text-(--accent) outline-none focus:ring-2 focus:ring-(--accent)/30 data-[state=checked]:bg-(--accent) data-[state=checked]:text-white ${className}`}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
