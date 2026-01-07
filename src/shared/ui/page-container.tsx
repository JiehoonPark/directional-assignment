import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
};

export function PageContainer({ children, className = '', fullHeight }: PageContainerProps) {
  const heightClass = fullHeight ? 'h-[calc(100vh-64px)]' : '';
  return (
    <div className={`max-w-6xl mx-auto px-6 py-6 flex flex-col min-h-0 ${heightClass} ${className}`}>
      {children}
    </div>
  );
}
