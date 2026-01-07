import React from 'react';

type SectionProps = React.PropsWithChildren<{
  title?: string;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}>;

export function Section({
  title,
  actions,
  className = '',
  bodyClassName = '',
  children,
}: SectionProps) {
  const hasHeader = Boolean(title || actions);
  return (
    <section className={`bg-white rounded-lg border border-subtle shadow-sm ${className}`}>
      {hasHeader ? (
        <header className="flex items-center justify-between px-4 py-3 border-b border-subtle">
          <div>{title ? <h2 className="text-base font-semibold">{title}</h2> : null}</div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
