'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/entities/post';
import type { Post } from '@/entities/post';

export function usePostMutations() {
  const queryClient = useQueryClient();
  // 게시글 목록 캐시를 공통으로 갱신
  const invalidatePosts = () => queryClient.invalidateQueries({ queryKey: ['posts'] });

  const deleteMutation = useMutation({
    mutationFn: (post: Post) => postApi.deletePost(post.id),
    onSuccess: invalidatePosts,
  });

  const deleteAllMutation = useMutation({
    mutationFn: () => postApi.deleteAllPosts(),
    onSuccess: invalidatePosts,
  });

  return { deleteMutation, deleteAllMutation };
}
