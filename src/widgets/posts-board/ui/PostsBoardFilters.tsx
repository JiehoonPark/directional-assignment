'use client';

import type { ReactNode } from 'react';
import type { PostCategory } from '@/entities/post';
import { PostFilters } from '@/features/post-filters';
import { Button } from '@/shared/ui/button';

import { usePostsBoardContext } from '../model/PostsBoardContext';

type PostsBoardFiltersProps = {
  columnToggle?: ReactNode;
  onOpenDeleteAll: () => void;
  canDeleteAll: boolean;
  isDeletingAll: boolean;
};

export function PostsBoardFilters({
  columnToggle,
  onOpenDeleteAll,
  canDeleteAll,
  isDeletingAll,
}: PostsBoardFiltersProps) {
  const { board } = usePostsBoardContext();
  const { filters, updateFilters } = board.filtersState;

  return (
    <div className="space-y-3">
      <PostFilters
        search={filters.search}
        onSearchSubmit={(value) => updateFilters({ search: value })}
        category={filters.category}
        onCategoryChange={(value) => updateFilters({ category: value as PostCategory | 'ALL' })}
        sort={filters.sort}
        onSortChange={(value) => updateFilters({ sort: value })}
        order={filters.order}
        onOrderChange={(value) => updateFilters({ order: value })}
      />

      <div className="flex flex-wrap items-center justify-between">
        <div>{columnToggle}</div>

        {canDeleteAll ? (
          <Button variant="danger" size="sm" onClick={onOpenDeleteAll} disabled={isDeletingAll}>
            {isDeletingAll ? '삭제 중...' : '전체 삭제'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
