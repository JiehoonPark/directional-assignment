import { httpRequest } from '@/shared/api';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { Post } from '../model/types';

export async function getPostById(id: string) {
  const token = tokenStorage.load();
  return httpRequest<Post>(`/posts/${id}`, {
    method: 'GET',
    token: token ?? undefined,
  });
}
