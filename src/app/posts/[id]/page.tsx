'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { Post } from '@/entities/post';
import { CategoryBadge, postApi } from '@/entities/post';
import { useAuthSession } from '@/features/auth';
import { useMockPostsQuery } from '@/features/post-list';
import { formatDateTime } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PageContainer } from '@/shared/ui/page-container';
import { Section } from '@/shared/ui/section';
import { Spinner } from '@/shared/ui/spinner';

const PUBLIC_POSTS_COUNT = 300;

export default function PostDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? '';

  const isMockId = Boolean(id) && id.startsWith('m_');
  const isPublic = isMockId;
  const isPrivate = Boolean(id) && !isMockId;
  const { token, isHydrated } = useAuthSession();
  const hasToken = Boolean(token);
  const backToListHref = '/posts';

  const publicQuery = useMockPostsQuery({
    count: PUBLIC_POSTS_COUNT,
    enabled: Boolean(isPublic && id),
  });

  const publicPost = publicQuery.data?.items.find((item) => item.id === id);

  const privateQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPostById(id),
    enabled: Boolean(isPrivate && id && hasToken && isHydrated),
  });

  const canDelete =
    isPrivate && isHydrated && hasToken && Boolean(privateQuery.data?.id);
  const canEdit = canDelete;

  const deleteMutation = useMutation({
    mutationFn: () => postApi.deletePost(id),
  });

  const handleDelete = async () => {
    if (!canDelete) return;
    const confirmed = window.confirm('해당 게시글을 삭제하시겠어요?');
    if (!confirmed) return;
    await deleteMutation.mutateAsync();
    router.push('/posts');
  };

  const post: Post | null = isPublic ? publicPost ?? null : privateQuery.data ?? null;
  const isLoading = isPublic
    ? publicQuery.isLoading
    : privateQuery.isLoading || (isPrivate && !isHydrated);

  const errorMessage = (() => {
    if (!id) return '잘못된 접근입니다.';
    if (isPrivate && isHydrated && !hasToken) {
      return '로그인이 필요합니다. 게시판에서 로그인 후 다시 시도해주세요.';
    }
    if (isPublic && publicQuery.isError) {
      return '게시글을 불러오지 못했습니다.';
    }
    if (isPrivate && privateQuery.isError) {
      return privateQuery.error instanceof Error
        ? privateQuery.error.message
        : '게시글을 불러오지 못했습니다.';
    }
    if (!isLoading && !post) {
      return '게시글을 찾을 수 없습니다.';
    }
    return undefined;
  })();

  return (
    <PageContainer className="space-y-6">
      <Section
        title="게시글 상세"
        actions={
          <div className="flex items-center gap-2">
            {canDelete ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/posts/${id}/edit`)}
              >
                수정
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="sm">
              <Link href={backToListHref}>목록으로</Link>
            </Button>
          </div>
        }
      >
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner /> 불러오는 중...
          </div>
        ) : errorMessage ? (
          <p className="text-sm text-(--danger)">{errorMessage}</p>
        ) : post ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-1 text-xs text-muted">{formatDateTime(post.createdAt)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={post.category} />
              {post.tags.map((tag) => (
                <Badge key={tag} tone="muted">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="whitespace-pre-line text-sm text-slate-700">{post.body}</p>
          </div>
        ) : null}
      </Section>
    </PageContainer>
  );
}
