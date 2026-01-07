import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import { LoginDialogContainer } from '@/features/auth';
import { GlobalNav } from '@/widgets/global-nav';
import { Providers } from './providers';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Directional Board',
  description: 'Directional 프론트엔드 과제 - 게시판 및 시각화',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-surface text-foreground`}
      >
        <Providers>
          <div className="min-h-screen bg-surface text-foreground flex flex-col">
            <GlobalNav />
            <LoginDialogContainer />
            <main className="flex-1 min-h-0 bg-surface">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
