'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { Post } from '@/entities/post';

import { usePostsBoard } from './usePostsBoard';
import type { DataSource } from './types';
import type { PostFiltersState } from '@/features/post-filters/model/types';

type PostsBoardContextValue = {
  board: ReturnType<typeof usePostsBoard>;
  derived: {
    isPrivateView: boolean;
    canManagePrivate: boolean;
    tableData: Post[];
    isTableLoading: boolean;
    canLoadMore: boolean;
    handleLoadMore?: () => void;
    isFetchingMore: boolean;
    actionsEnabled: boolean;
  };
  ui: {
    isDeleteAllOpen: boolean;
    openDeleteAll: () => void;
    closeDeleteAll: () => void;
  };
};

const PostsBoardContext = createContext<PostsBoardContextValue | null>(null);

type PostsBoardProviderProps = {
  initialDataSource?: DataSource;
  initialFilters?: Partial<PostFiltersState>;
  children: ReactNode;
};

export function PostsBoardProvider({
  initialDataSource,
  initialFilters,
  children,
}: PostsBoardProviderProps) {
  const board = usePostsBoard({ initialDataSource, initialFilters });
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);

  // 화면에서 자주 쓰는 파생 상태를 한 번에 계산하여 내려줌
  const derived = useMemo<PostsBoardContextValue['derived']>(() => {
    const isPrivateView = board.dataSourceState.dataSource === 'private';
    // 내 글 + 로그인 되었을 경우 수정/삭제를 허용
    const canManagePrivate =
      isPrivateView && board.authState.isHydrated && Boolean(board.authState.token);
    const tableData = isPrivateView ? board.listState.privatePosts : board.listState.publicVisibleItems;
    const isTableLoading = isPrivateView
      ? board.listState.isPrivateLoading && board.listState.privatePosts.length === 0
      : board.listState.isPublicLoading && board.listState.publicVisibleItems.length === 0;
    const canLoadMore = isPrivateView
      ? Boolean(board.listState.hasPrivateNextPage)
      : board.listState.publicHasMore;
    const handleLoadMore = isPrivateView
      ? board.listState.hasPrivateNextPage
        ? () => board.listState.fetchNextPrivatePage()
        : undefined
      : board.listState.publicHasMore
      ? board.actions.loadMorePublic
      : undefined;
    const isFetchingMore = isPrivateView ? board.listState.isFetchingNextPrivatePage : false;
    const actionsEnabled =
      isPrivateView && board.authState.isHydrated && Boolean(board.authState.token);

    return {
      isPrivateView,
      canManagePrivate,
      tableData,
      isTableLoading,
      canLoadMore,
      handleLoadMore,
      isFetchingMore,
      actionsEnabled,
    };
  }, [
    board.actions.loadMorePublic,
    board.authState.isHydrated,
    board.authState.token,
    board.dataSourceState.dataSource,
    board.listState.fetchNextPrivatePage,
    board.listState.hasPrivateNextPage,
    board.listState.isFetchingNextPrivatePage,
    board.listState.isPrivateLoading,
    board.listState.isPublicLoading,
    board.listState.privatePosts,
    board.listState.publicHasMore,
    board.listState.publicVisibleItems,
  ]);

  return (
    <PostsBoardContext.Provider
      value={{
        board,
        derived,
        ui: {
          isDeleteAllOpen,
          openDeleteAll: () => setIsDeleteAllOpen(true),
          closeDeleteAll: () => setIsDeleteAllOpen(false),
        },
      }}
    >
      {children}
    </PostsBoardContext.Provider>
  );
}

export function usePostsBoardContext() {
  const context = useContext(PostsBoardContext);
  if (!context) {
    throw new Error('PostsBoardProvider가 필요합니다.');
  }
  return context;
}
