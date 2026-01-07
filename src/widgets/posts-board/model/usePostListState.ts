'use client';

import { useEffect, useState } from 'react';

import type { Post } from '@/entities/post';
import type { PostFiltersState } from '@/features/post-filters';
import { useMockPostsQuery, usePostsInfiniteQuery } from '@/features/post-list';

import { MOCK_PAGE_SIZE, MOCK_TOTAL_DEFAULT } from '../config';

import type { DataSource } from './types';

type UsePostListStateProps = {
  filters: PostFiltersState;
  dataSource: DataSource;
  token: string | null;
};

const filterPostsBySearch = (items: Post[], search: string) => {
  const trimmed = search.trim();
  if (!trimmed) return items;
  const lowered = trimmed.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(lowered) ||
      item.body.toLowerCase().includes(lowered),
  );
};

const filterPostsByCategory = (items: Post[], category: PostFiltersState['category']) => {
  if (category === 'ALL') return items;
  return items.filter((item) => item.category === category);
};

const sortPostList = (
  items: Post[],
  sort: PostFiltersState['sort'],
  order: PostFiltersState['order'],
) => {
  const orderMultiplier = order === 'asc' ? 1 : -1;
  if (sort === 'createdAt') {
    return [...items].sort(
      (a, b) =>
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * orderMultiplier,
    );
  }

  return [...items].sort((a, b) => a.title.localeCompare(b.title) * orderMultiplier);
};

const buildPublicPostList = (items: Post[], filters: PostFiltersState) =>
  sortPostList(
    filterPostsByCategory(filterPostsBySearch(items, filters.search), filters.category),
    filters.sort,
    filters.order,
  );

export function usePostListState({ filters, dataSource, token }: UsePostListStateProps) {
  // 목업 데이터는 클라이언트에서 가상 페이지네이션한다.
  const [publicVisibleCount, setPublicVisibleCount] = useState(MOCK_PAGE_SIZE);
  const isPublicView = dataSource === 'public';
  const isPrivateView = dataSource === 'private';
  const normalizedSearch = filters.search.trim();

  useEffect(() => {
    // 전체 글로 돌아오면 보여주는 개수를 초기화한다.
    if (isPublicView) {
      setPublicVisibleCount(MOCK_PAGE_SIZE);
    }
  }, [isPublicView]);

  // "내 글"은 서버 커서 기반 무한 스크롤 사용
  const {
    data: privateData,
    isLoading: isPrivateLoading,
    isFetchingNextPage: isFetchingNextPrivatePage,
    fetchNextPage: fetchNextPrivatePage,
    hasNextPage: hasPrivateNextPage,
  } = usePostsInfiniteQuery({
    search: normalizedSearch || undefined,
    category: filters.category === 'ALL' ? undefined : filters.category,
    sort: filters.sort,
    order: filters.order,
    enabled: isPrivateView && Boolean(token),
  });

  // "전체 글"은 고정 목업 데이터를 내려받아 필터/정렬을 적용
  const {
    data: publicData,
    isLoading: isPublicLoading,
  } = useMockPostsQuery({
    count: MOCK_TOTAL_DEFAULT,
    enabled: isPublicView,
  });

  const publicItems = publicData?.items ?? [];
  const publicFiltered = buildPublicPostList(publicItems, {
    ...filters,
    search: normalizedSearch,
  });

  const publicVisibleItems = publicFiltered.slice(0, publicVisibleCount);

  const publicHasMore = publicVisibleCount < publicFiltered.length;

  // 목업 목록은 일정 개수씩 화면에 추가
  const loadMorePublic = () => {
    setPublicVisibleCount((previousCount) => {
      const nextCount = previousCount + MOCK_PAGE_SIZE;
      return Math.min(nextCount, publicFiltered.length);
    });
  };

  const privatePosts = (privateData?.pages ?? []).flatMap((page) => page?.items ?? []);

  return {
    publicVisibleItems,
    publicHasMore,
    privatePosts,
    isPrivateLoading,
    isPublicLoading,
    isFetchingNextPrivatePage,
    hasPrivateNextPage,
    fetchNextPrivatePage,
    loadMorePublic,
  };
}
