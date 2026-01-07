'use client';

import { useSearchParams, useRouter } from 'next/navigation';

import { PostTableColumnToggle, PostTableProvider } from '@/features/post-table';
import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Section } from '@/shared/ui/section';

import { LoginDialog } from '@/features/auth';
import { PostToolbar } from './PostToolbar';
import { PostsBoardFilters } from './PostsBoardFilters';
import { PostsBoardTable } from './PostsBoardTable';
import { PostsBoardProvider, usePostsBoardContext } from '../model/PostsBoardContext';
import { parsePostFiltersFromSearchParams, usePostsBoardQuerySync } from '../model/usePostsBoardQuerySync';

export function PostsBoard() {
  const searchParams = useSearchParams();
  const sourceParam = searchParams.get('source');
  const initialDataSource =
    sourceParam === 'public' || sourceParam === 'private' ? sourceParam : undefined;
  const initialFilters = parsePostFiltersFromSearchParams(
    new URLSearchParams(searchParams.toString()),
  );

  return (
    <PostsBoardProvider initialDataSource={initialDataSource} initialFilters={initialFilters}>
      <PostsBoardContent />
    </PostsBoardProvider>
  );
}

function PostsBoardContent() {
  const { board, derived, ui } = usePostsBoardContext();
  const router = useRouter();
  // URL 쿼리와 필터 상태를 동기화
  usePostsBoardQuerySync({
    filters: board.filtersState.filters,
    setFilters: board.filtersState.setFilters,
  });

  const handleDeleteAll = async () => {
    if (!derived.canManagePrivate) return;
    await board.mutations.deleteAllMutation.mutateAsync();
    ui.closeDeleteAll();
  };

  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      <Section className="flex flex-col flex-1 min-h-0" bodyClassName="flex flex-col gap-4 flex-1 min-h-0" title="게시글 목록">
        <PostTableProvider
          data={derived.tableData}
          onEdit={(post) => {
            const canEdit = board.actions.ensureAuth();
            if (!canEdit) return;
            router.push(`/posts/${post.id}/edit`);
          }}
          onDelete={(post) => board.mutations.deleteMutation.mutate(post)}
          actionsEnabled={derived.actionsEnabled}
          showActions={derived.actionsEnabled}
        >
          <div className="sticky top-16 z-20 -mx-4 -mt-4 space-y-4 border-b border-subtle bg-white/95 px-4 py-4 backdrop-blur">
            <PostToolbar />
            <PostsBoardFilters
              columnToggle={<PostTableColumnToggle />}
              onOpenDeleteAll={ui.openDeleteAll}
              canDeleteAll={derived.canManagePrivate}
              isDeletingAll={board.mutations.deleteAllMutation.isPending}
            />
          </div>

          <div className="flex-1 min-h-0">
            <PostsBoardTable />
          </div>
        </PostTableProvider>
      </Section>

      <LoginDialog
        open={board.authState.isLoginOpen}
        onClose={board.authState.closeLogin}
        email={board.authState.loginForm.email}
        password={board.authState.loginForm.password}
        onEmailChange={(value) =>
          board.authState.setLoginForm((previousForm) => ({ ...previousForm, email: value }))
        }
        onPasswordChange={(value) =>
          board.authState.setLoginForm((previousForm) => ({ ...previousForm, password: value }))
        }
        onSubmit={board.authState.login}
        isSubmitting={board.authState.loginMutation.isPending}
        errorMessage={
          board.authState.loginMutation.isError
            ? (board.authState.loginMutation.error as Error)?.message ?? '확인해주세요'
            : undefined
        }
      />

      <Dialog
        open={ui.isDeleteAllOpen}
        onClose={ui.closeDeleteAll}
        title="내 게시글 전체 삭제"
        description="삭제된 게시글은 복구할 수 없습니다."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted">정말로 모든 게시글을 삭제하시겠어요?</p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={ui.closeDeleteAll}>
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAll}
              disabled={board.mutations.deleteAllMutation.isPending}
            >
              {board.mutations.deleteAllMutation.isPending ? '삭제 중...' : '전체 삭제'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
