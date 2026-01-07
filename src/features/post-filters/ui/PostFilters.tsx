'use client';

import { useEffect, useRef } from 'react';
import type { PostCategory } from '@/entities/post';
import { Input } from '@/shared/ui/input';
import { Select, SelectItem } from '@/shared/ui/select';
import { Search } from 'lucide-react';

import {
  CATEGORY_OPTIONS,
  ORDER_OPTIONS,
  SORT_OPTIONS,
} from '../config/options';
import type { SortField, SortOrder } from '../model/types';

type PostFiltersProps = {
  search: string;
  onSearchSubmit: (value: string) => void;
  category: PostCategory | 'ALL';
  onCategoryChange: (value: PostCategory | 'ALL') => void;
  sort: SortField;
  onSortChange: (value: SortField) => void;
  order: SortOrder;
  onOrderChange: (value: SortOrder) => void;
};

export function PostFilters({
  search,
  onSearchSubmit,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  order,
  onOrderChange,
}: PostFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchRef.current) return;
    if (searchRef.current.value === search) return;
    searchRef.current.value = search;
  }, [search]);

  const handleSubmit = () => {
    onSearchSubmit(searchRef.current?.value ?? '');
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-1 flex-wrap items-end gap-3">
        <div className="flex-1 min-w-65">
          <label className="text-sm font-medium text-muted">검색 (제목/본문)</label>
          <form
            className="relative mt-1"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <button
              type="button"
              onClick={handleSubmit}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600"
              aria-label="검색 실행"
            >
              <Search size={16} />
            </button>
            <Input
              ref={searchRef}
              defaultValue={search}
              placeholder="제목, 본문 검색..."
              className="pl-9"
            />
          </form>
        </div>

        <div>
          <label className="text-sm font-medium text-muted">카테고리</label>
          <Select
            value={category}
            onValueChange={(value) => onCategoryChange(value as PostCategory | 'ALL')}
            className="mt-1 min-w-35"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted">정렬</label>
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as SortField)}
            className="mt-1 min-w-35"
          >
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted">정렬 방향</label>
          <Select
            value={order}
            onValueChange={(value) => onOrderChange(value as SortOrder)}
            className="mt-1 min-w-35"
          >
            {ORDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
