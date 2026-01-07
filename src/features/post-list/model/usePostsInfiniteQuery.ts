'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { postApi, PostQueryParams } from '@/entities/post';

const DEFAULT_PAGE_SIZE = 20;

type UsePostsInfiniteQueryProps = PostQueryParams & {
  enabled?: boolean;
};

export function usePostsInfiniteQuery({
  enabled = true,
  ...params
}: UsePostsInfiniteQueryProps) {
  const { limit = DEFAULT_PAGE_SIZE, category, sort, order, search, from, to } = params;

  return useInfiniteQuery({
    enabled,
    queryKey: ['posts', { category, sort, order, search, from, to, limit }],
    queryFn: ({ pageParam }) =>
      postApi.getPosts({
        limit,
        category,
        sort,
        order,
        search,
        from,
        to,
        nextCursor: pageParam ?? undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    getPreviousPageParam: (lastPage) => lastPage?.prevCursor ?? undefined,
  });
}
