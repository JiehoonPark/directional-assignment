'use client';

import { usePostFiltersState } from '@/features/post-filters';
import type { PostFiltersState } from '@/features/post-filters/model/types';

import { usePostAuthState } from './usePostAuthState';
import { usePostDataSourceState } from './usePostDataSourceState';
import { usePostListState } from './usePostListState';
import { usePostMutations } from './usePostMutations';
import type { DataSource } from './types';

export type { DataSource } from './types';

type UsePostsBoardProps = {
  initialDataSource?: DataSource;
  initialFilters?: Partial<PostFiltersState>;
};

export function usePostsBoard({ initialDataSource, initialFilters }: UsePostsBoardProps = {}) {
  const { filters, setFilters, updateFilters } = usePostFiltersState(initialFilters);
  const authState = usePostAuthState();
  const mutations = usePostMutations();
  const dataSourceState = usePostDataSourceState({
    token: authState.token,
    openLogin: authState.openLogin,
    initialDataSource,
    isHydrated: authState.isHydrated,
  });
  const { dataSource } = dataSourceState;
  const listState = usePostListState({
    filters,
    dataSource,
    token: authState.token,
  });

  const ensureAuth = () => {
    if (!authState.token) {
      authState.openLogin();
      return false;
    }
    return true;
  };

  const requestCreate = () => {
    if (!ensureAuth()) return false;
    return true;
  };

  return {
    authState: {
      token: authState.token,
      isHydrated: authState.isHydrated,
      loginForm: authState.loginForm,
      setLoginForm: authState.setLoginForm,
      isLoginOpen: authState.isLoginOpen,
      openLogin: authState.openLogin,
      closeLogin: authState.closeLogin,
      login: authState.login,
      logout: authState.logout,
      loginMutation: authState.loginMutation,
    },
    filtersState: {
      filters,
      setFilters,
      updateFilters,
    },
    dataSourceState: {
      dataSource,
      changeDataSource: dataSourceState.changeDataSource,
    },
    listState: {
      publicVisibleItems: listState.publicVisibleItems,
      publicHasMore: listState.publicHasMore,
      privatePosts: listState.privatePosts,
      isPrivateLoading: listState.isPrivateLoading,
      isPublicLoading: listState.isPublicLoading,
      isFetchingNextPrivatePage: listState.isFetchingNextPrivatePage,
      hasPrivateNextPage: listState.hasPrivateNextPage,
      fetchNextPrivatePage: listState.fetchNextPrivatePage,
    },
    actions: {
      requestCreate,
      loadMorePublic: listState.loadMorePublic,
      ensureAuth,
    },
    mutations: {
      deleteMutation: mutations.deleteMutation,
      deleteAllMutation: mutations.deleteAllMutation,
    },
  };
}
