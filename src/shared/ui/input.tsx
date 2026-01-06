import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-subtle bg-white px-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
