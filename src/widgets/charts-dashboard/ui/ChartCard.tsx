import type { ReactNode } from 'react';

import { Spinner } from '@/shared/ui/spinner';

type ChartCardProps = {
  title: string;
  legend?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
  errorMessage?: string;
  children?: ReactNode;
};

export function ChartCard({
  title,
  legend,
  footer,
  isLoading,
  errorMessage,
  children,
}: ChartCardProps) {
  const hasError = Boolean(errorMessage);

  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border border-subtle bg-slate-50/70 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {legend}
      <div className="relative flex min-h-[220px] items-center justify-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted">
            <Spinner />
            데이터 불러오는 중
          </div>
        ) : hasError ? (
          <p className="text-xs text-[var(--danger)]">{errorMessage}</p>
        ) : (
          children
        )}
      </div>
      {footer ? <div className="text-xs text-muted">{footer}</div> : null}
    </div>
  );
}
