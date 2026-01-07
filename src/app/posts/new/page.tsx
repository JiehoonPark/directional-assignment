'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postApi } from '@/entities/post';
import { useAuthSession } from '@/features/auth';
import type { PostFormValues } from '@/features/post-form';
import { PostForm, toPostPayload } from '@/features/post-form';
import { Button } from '@/shared/ui/button';
import { postsBoardSourceStorage } from '@/shared/lib/postsBoardSourceStorage';
import { PageContainer } from '@/shared/ui/page-container';
import { Section } from '@/shared/ui/section';

export default function PostCreatePage() {
  const { token, isHydrated } = useAuthSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const listHref = '/posts';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (values: PostFormValues) => postApi.createPost(toPostPayload(values)),
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      postsBoardSourceStorage.save('private');
      router.push(listHref);
    },
    onError: (error) => {
      setErrorMessage(error instanceof Error ? error.message : '게시글 생성에 실패했습니다.');
    },
  });

  if (!isHydrated) {
    return (
      <PageContainer className="space-y-6">
        <Section title="새 글 작성">
          <p className="text-sm text-muted">로그인 상태를 확인 중입니다...</p>
        </Section>
      </PageContainer>
    );
  }

  if (!token) {
    return (
      <PageContainer className="space-y-6">
        <Section title="새 글 작성">
          <p className="text-sm text-muted">
            게시글 작성은 로그인 후 이용할 수 있습니다. 게시판으로 이동해 로그인해주세요.
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push(listHref)}>게시판으로</Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="space-y-6">
      <Section title="새 글 작성">
        {errorMessage ? <p className="mb-3 text-sm text-(--danger)">{errorMessage}</p> : null}
        <PostForm
          onSubmit={async (values) => {
            await createMutation.mutateAsync(values);
          }}
          onCancel={() => router.push(listHref)}
          submitting={createMutation.isPending}
        />
      </Section>
    </PageContainer>
  );
}
