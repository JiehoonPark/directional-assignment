'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { defaultPostFilters } from '@/features/post-filters/config/defaults';
import type { PostFiltersState } from '@/features/post-filters/model/types';

const CATEGORY_VALUES: PostFiltersState['category'][] = ['ALL', 'NOTICE', 'QNA', 'FREE'];
const SORT_VALUES: PostFiltersState['sort'][] = ['createdAt', 'title'];
const ORDER_VALUES: PostFiltersState['order'][] = ['asc', 'desc'];

// URL 파라미터에서 허용된 값만 복원
const parseEnumParam = <T extends string>(value: string | null, allowed: T[], fallback: T) =>
  value && allowed.includes(value as T) ? (value as T) : fallback;

export const parsePostFiltersFromSearchParams = (params: URLSearchParams): PostFiltersState => {
  return {
    search: params.get('search') ?? defaultPostFilters.search,
    category: parseEnumParam(params.get('category'), CATEGORY_VALUES, defaultPostFilters.category),
    sort: parseEnumParam(params.get('sort'), SORT_VALUES, defaultPostFilters.sort),
    order: parseEnumParam(params.get('order'), ORDER_VALUES, defaultPostFilters.order),
  };
};

const filtersEqual = (a: PostFiltersState, b: PostFiltersState) =>
  a.search === b.search &&
  a.category === b.category &&
  a.sort === b.sort &&
  a.order === b.order;

const buildFiltersSearchParams = (current: string, filters: PostFiltersState) => {
  const params = new URLSearchParams(current);
  const normalizedSearch = filters.search.trim();

  if (normalizedSearch) {
    params.set('search', normalizedSearch);
  } else {
    params.delete('search');
  }

  if (filters.category !== defaultPostFilters.category) {
    params.set('category', filters.category);
  } else {
    params.delete('category');
  }

  if (filters.sort !== defaultPostFilters.sort) {
    params.set('sort', filters.sort);
  } else {
    params.delete('sort');
  }

  if (filters.order !== defaultPostFilters.order) {
    params.set('order', filters.order);
  } else {
    params.delete('order');
  }

  return params;
};

type UsePostsBoardQuerySyncProps = {
  filters: PostFiltersState;
  setFilters: (next: PostFiltersState) => void;
};

export function usePostsBoardQuerySync({ filters, setFilters }: UsePostsBoardQuerySyncProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearchParams = searchParams.toString();
  const isSyncingFromUrlRef = useRef(false);
  const latestFiltersRef = useRef(filters);

  useEffect(() => {
    latestFiltersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    // URL -> 상태 동기화 (뒤로가기/직접 입력 대응)
    const nextFilters = parsePostFiltersFromSearchParams(
      new URLSearchParams(currentSearchParams),
    );
    if (filtersEqual(latestFiltersRef.current, nextFilters)) return;
    isSyncingFromUrlRef.current = true;
    setFilters(nextFilters);
  }, [currentSearchParams, setFilters]);

  useEffect(() => {
    // 상태 -> URL 동기화 (중복 push 방지)
    if (isSyncingFromUrlRef.current) {
      isSyncingFromUrlRef.current = false;
      return;
    }
    const nextParams = buildFiltersSearchParams(currentSearchParams, filters);
    const nextQuery = nextParams.toString();
    if (nextQuery === currentSearchParams) return;
    router.push(nextQuery ? `/posts?${nextQuery}` : '/posts', { scroll: false });
  }, [filters, router, currentSearchParams]);
}
