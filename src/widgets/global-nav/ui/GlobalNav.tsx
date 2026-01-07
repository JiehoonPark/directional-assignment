'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthSession, useLoginModal } from '@/features/auth';
import { Button } from '@/shared/ui/button';

const NAV_ITEMS = [
  { href: '/posts', label: '게시판', match: (path: string) => path.startsWith('/posts') },
  { href: '/charts', label: '차트', match: (path: string) => path.startsWith('/charts') },
];

export function GlobalNav() {
  const pathname = usePathname() ?? '';
  const { isLoggedIn, logout, isHydrated } = useAuthSession();
  const { open: openLogin } = useLoginModal();

  const handleLoginClick = () => {
    openLogin();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-subtle bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-2 text-xs sm:gap-4 sm:text-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-sm px-3 py-1 transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {isHydrated ? (
          isLoggedIn ? (
            <Button variant="secondary" size="sm" onClick={logout}>
              로그아웃
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLoginClick}>
              로그인
            </Button>
          )
        ) : (
          <div className="h-9 w-20" aria-hidden />
        )}
      </div>
    </header>
  );
}
