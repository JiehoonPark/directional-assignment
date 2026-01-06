import { httpRequest } from '@/shared/api';
import { Post } from '../model/types';

export type MockPostListResponse = {
  items: Post[];
  count: number;
};

export async function getMockPosts(count = 300) {
  const search = new URLSearchParams();
  search.append('count', String(count));

  return httpRequest<MockPostListResponse>(`/mock/posts?${search.toString()}`, {
    method: 'GET',
  });
}
