'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/entities/post';
import { useAuthSession } from '@/features/auth';
import type { PostFormValues } from '@/features/post-form';
import { PostForm, toPostPayload } from '@/features/post-form';
import { Button } from '@/shared/ui/button';
import { PageContainer } from '@/shared/ui/page-container';
import { Section } from '@/shared/ui/section';
import { Spinner } from '@/shared/ui/spinner';

const LIST_HREF = '/posts';

export default function PostEditPage() {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token, isHydrated } = useAuthSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? '';
  const isMockId = Boolean(id) && id.startsWith('m_');

  // 로그인 + 유효한 id일 때만 내 글을 조회
  const postQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPostById(id),
    enabled: Boolean(id && token && isHydrated && !isMockId),
  });

  const updateMutation = useMutation({
    mutationFn: (values: PostFormValues) => postApi.updatePost(id, toPostPayload(values)),
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      router.push(`/posts/${id}`);
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : '게시글 수정에 실패했습니다.');
    },
  });

  if (!isHydrated) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <p className="text-sm text-muted">로그인 상태를 확인 중입니다...</p>
        </Section>
      </PageContainer>
    );
  }

  if (!id) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <p className="text-sm text-muted">잘못된 접근입니다.</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push(LIST_HREF)}>게시판으로</Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (!token) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <p className="text-sm text-muted">
            게시글 수정은 로그인 후 이용할 수 있습니다. 게시판으로 이동해 로그인해주세요.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push(LIST_HREF)}>게시판으로</Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (isMockId) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <p className="text-sm text-muted">목업 게시글은 수정할 수 없습니다.</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push(LIST_HREF)}>게시판으로</Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (postQuery.isLoading) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner /> 불러오는 중...
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (postQuery.isError) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <p className="text-sm text-(--danger)">
            {postQuery.error instanceof Error
              ? postQuery.error.message
              : '게시글을 불러오지 못했습니다.'}
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push(LIST_HREF)}>게시판으로</Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  const post = postQuery.data ?? null;

  if (!post) {
    return (
      <PageContainer className="space-y-6">
        <Section title="게시글 수정">
          <p className="text-sm text-muted">게시글을 찾을 수 없습니다.</p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push(LIST_HREF)}>게시판으로</Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <Section title="게시글 수정">
        {errorMessage ? <p className="mb-3 text-sm text-(--danger)">{errorMessage}</p> : null}
        <PostForm
          initialValues={post}
          onSubmit={async (values) => {
            await updateMutation.mutateAsync(values);
          }}
          onCancel={() => router.push(`/posts/${id}`)}
          submitting={updateMutation.isPending}
        />
      </Section>
    </PageContainer>
  );
}
