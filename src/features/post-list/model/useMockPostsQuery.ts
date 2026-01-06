import { useQuery } from '@tanstack/react-query';

import { postApi } from '@/entities/post';

type UseMockPostsQueryOptions = {
  count?: number;
  enabled?: boolean;
};

export function useMockPostsQuery({ count = 300, enabled = true }: UseMockPostsQueryOptions) {
  return useQuery({
    enabled,
    queryKey: ['mock-posts', { count }],
    queryFn: () => postApi.getMockPosts(count),
    staleTime: Infinity,
  });
}
