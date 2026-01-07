'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { tokenStorage } from '@/shared/api/tokenStorage';

const subscribe = (listener: () => void) => tokenStorage.subscribe(listener);
const getSnapshot = () => tokenStorage.load();
const getServerSnapshot = () => null;

export function useAuthSession() {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // SSR/CSR 불일치 방지를 위해 클라이언트 하이드레이션 이후 토큰을 사용
    setIsHydrated(true);
  }, []);

  const logout = () => {
    tokenStorage.clear();
  };

  const effectiveToken = isHydrated ? token : null;

  return {
    token: effectiveToken,
    isLoggedIn: Boolean(effectiveToken),
    isHydrated,
    logout,
  };
}
