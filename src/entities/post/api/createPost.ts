import { httpRequest } from '@/shared/api';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { Post, PostCreateRequest } from '../model/types';

export async function createPost(payload: PostCreateRequest) {
  const token = tokenStorage.load();
  return httpRequest<Post>('/posts', {
    method: 'POST',
    body: payload,
    token: token ?? undefined,
  });
}
