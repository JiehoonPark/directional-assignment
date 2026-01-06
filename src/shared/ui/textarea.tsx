import React from 'react';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`min-h-35 w-full rounded-md border border-subtle bg-white px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
