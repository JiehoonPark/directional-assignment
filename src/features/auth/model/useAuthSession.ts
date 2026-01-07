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
