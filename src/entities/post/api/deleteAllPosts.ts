import { httpRequest } from '@/shared/api';
import { tokenStorage } from '@/shared/api/tokenStorage';

export async function deleteAllPosts() {
  const token = tokenStorage.load();
  return httpRequest<{ ok: boolean; deleted: number }>('/posts', {
    method: 'DELETE',
    token: token ?? undefined,
  });
}
