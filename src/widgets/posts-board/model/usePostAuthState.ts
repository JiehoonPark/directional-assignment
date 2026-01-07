'use client';

import { useAuthSession, useLoginModal } from '@/features/auth';

export function usePostAuthState() {
  const { token, isHydrated } = useAuthSession();
  const { open } = useLoginModal();

  return {
    token,
    openLogin: open,
    isHydrated,
  };
}
