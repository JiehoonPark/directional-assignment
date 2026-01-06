import { httpRequest } from '@/shared/api';
import { tokenStorage } from '@/shared/api/tokenStorage';

export async function deletePost(id: string) {
  const token = tokenStorage.load();
  return httpRequest<{ ok: boolean; deleted: number }>(`/posts/${id}`, {
    method: 'DELETE',
    token: token ?? undefined,
  });
}
