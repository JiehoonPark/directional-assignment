'use client';

import { useEffect, useRef, useState } from 'react';

import type { DataSource } from './types';
import { postsBoardSourceStorage } from '@/shared/lib/postsBoardSourceStorage';

type UsePostDataSourceStateProps = {
  token: string | null;
  openLogin: () => void;
  initialDataSource?: DataSource;
  isHydrated?: boolean;
};

export function usePostDataSourceState({
  token,
  openLogin,
  initialDataSource,
  isHydrated = true,
}: UsePostDataSourceStateProps) {
  const [dataSource, setDataSource] = useState<DataSource>(initialDataSource ?? 'public');
  const didSyncFromStorageRef = useRef(false);

  useEffect(() => {
    // 글쓰기 완료 후 돌아온 경우, 저장된 탭 상태를 1회 복원원
    if (didSyncFromStorageRef.current) return;
    if (!isHydrated) return;
    if (initialDataSource) {
      didSyncFromStorageRef.current = true;
      return;
    }

    const storedSource = postsBoardSourceStorage.consume();
    didSyncFromStorageRef.current = true;
    if (!storedSource) return;
    if (storedSource === 'private' && !token) {
      setDataSource('public');
      return;
    }
    setDataSource(storedSource);
  }, [initialDataSource, isHydrated, token]);

  useEffect(() => {
    if (!isHydrated) return;
    // 로그인 해제 시 내 글 보기에서 자동으로 전체 글로 복귀
    if (!token && dataSource === 'private') {
      setDataSource('public');
    }
  }, [dataSource, isHydrated, token]);

  const changeDataSource = (value: DataSource) => {
    // 내 글 선택 시 로그인 상태를 먼저 확인
    if (value === 'private' && !token) {
      openLogin();
      setDataSource('public');
      return;
    }
    setDataSource(value);
  };

  return { dataSource, changeDataSource };
}
