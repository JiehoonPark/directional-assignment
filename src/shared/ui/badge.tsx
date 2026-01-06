import React from 'react';

type BadgeProps = React.PropsWithChildren<{
  tone?: 'default' | 'muted' | 'accent';
}>;

const toneClass: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'bg-slate-100 text-slate-800',
  muted: 'bg-slate-50 text-slate-600 border border-slate-200',
  accent: 'bg-(--accent)/10 text-[var(--accent-strong)]',
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
