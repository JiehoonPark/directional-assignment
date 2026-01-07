'use client';

import { Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/ui/button';

import { usePostsBoardContext } from '../model/PostsBoardContext';

export function PostToolbar() {
  const { board } = usePostsBoardContext();
  const router = useRouter();
  const toggleBase =
    'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-2xl border border-subtle bg-slate-100 p-1 shadow-inner">
          <button
            className={`${toggleBase} ${
              board.dataSourceState.dataSource === 'public'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => board.dataSourceState.changeDataSource('public')}
            aria-pressed={board.dataSourceState.dataSource === 'public'}
          >
            전체 글
          </button>
          <button
            className={`${toggleBase} ${
              board.dataSourceState.dataSource === 'private'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => board.dataSourceState.changeDataSource('private')}
            aria-pressed={board.dataSourceState.dataSource === 'private'}
          >
            <User size={16} />
            내 글
          </button>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <Button
          size="md"
          className="gap-2"
          onClick={() => {
            const canCreate = board.actions.requestCreate();
            if (!canCreate) return;
            router.push('/posts/new');
          }}
        >
          <Plus size={16} />
          새 글 작성
        </Button>
      </div>
    </div>
  );
}
