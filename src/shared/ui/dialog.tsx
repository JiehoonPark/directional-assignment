'use client';

import React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

type DialogProps = React.PropsWithChildren<{
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
}>;

export function Dialog({ open, title, description, onClose, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95">
          <div className="flex items-start justify-between px-5 py-4 border-b border-subtle">
            <div>
              {title ? <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title> : null}
              {description ? (
                <DialogPrimitive.Description className="text-sm text-muted mt-1">
                  {description}
                </DialogPrimitive.Description>
              ) : null}
            </div>
            <DialogPrimitive.Close asChild>
              <button
                aria-label="닫기"
                className="text-muted hover:text-foreground rounded p-1"
              >
                <X size={18} />
              </button>
            </DialogPrimitive.Close>
          </div>
          <div className="p-5">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
