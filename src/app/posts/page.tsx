import { PageContainer } from '@/shared/ui/page-container';
import { PostsBoard } from '@/widgets/posts-board';

export default function PostsRoute() {
  return (
    <PageContainer fullHeight>
      <PostsBoard />
    </PageContainer>
  );
}
