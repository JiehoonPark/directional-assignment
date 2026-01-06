import { httpRequest } from '@/shared/api';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { PostListResponse, PostQueryParams } from '../model/types';

export async function getPosts(params: PostQueryParams = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });
  const queryString = searchParams.toString();
  const token = tokenStorage.load();

  return httpRequest<PostListResponse>(`/posts${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
    token: token ?? undefined,
  });
}
