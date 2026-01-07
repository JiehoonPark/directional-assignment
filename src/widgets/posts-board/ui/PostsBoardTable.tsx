'use client';

import { useRouter } from 'next/navigation';

import { PostTable } from '@/features/post-table';
import type { Post } from '@/entities/post';

import { usePostsBoardContext } from '../model/PostsBoardContext';

export function PostsBoardTable() {
  const { derived } = usePostsBoardContext();
  const router = useRouter();

  const handleViewPost = (post: Post) => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <PostTable
      isLoading={derived.isTableLoading}
      onView={handleViewPost}
      onLoadMore={derived.handleLoadMore}
      canLoadMore={derived.canLoadMore}
      isFetchingMore={derived.isFetchingMore}
    />
  );
}
