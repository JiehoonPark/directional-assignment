import { httpRequest } from '@/shared/api';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { Post, PostUpdateRequest } from '../model/types';

export async function updatePost(id: string, payload: PostUpdateRequest) {
  const token = tokenStorage.load();
  return httpRequest<Post>(`/posts/${id}`, {
    method: 'PATCH',
    body: payload,
    token: token ?? undefined,
  });
}
