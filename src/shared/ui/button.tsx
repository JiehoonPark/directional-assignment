'use client';

import { Slot } from '@radix-ui/react-slot';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-(--accent) text-white hover:bg-[var(--accent-strong)] border border-transparent',
  secondary:
    'bg-slate-100 text-foreground border border-subtle hover:bg-slate-200',
  ghost:
    'bg-transparent text-foreground border border-transparent hover:bg-slate-100',
  danger:
    'bg-[var(--danger)] text-white border border-transparent hover:bg-[#b91c1c]',
  outline:
    'bg-transparent text-foreground border border-subtle hover:bg-slate-100',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild = false, variant = 'primary', size = 'md', className = '', ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${sizeClass[size]} ${variantClass[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
