import { Suspense } from 'react';

import { PageContainer } from '@/shared/ui/page-container';
import { Section } from '@/shared/ui/section';
import { PostsBoard } from '@/widgets/posts-board';

export default function PostsRoute() {
  return (
    <PageContainer fullHeight>
      <Suspense
        fallback={
          <div className="flex flex-col gap-6 flex-1 min-h-0">
            <Section
              className="flex flex-col flex-1 min-h-0"
              bodyClassName="flex flex-col gap-4 flex-1 min-h-0"
              title="게시글 목록"
            >
              <div className="flex-1 min-h-0 animate-pulse rounded-xl bg-muted/40" />
            </Section>
          </div>
        }
      >
        <PostsBoard />
      </Suspense>
    </PageContainer>
  );
}
