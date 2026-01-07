'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { login } from '@/features/auth/api/login';
import { useAuthSession, useLoginModal } from '@/features/auth';
import { tokenStorage } from '@/shared/api/tokenStorage';

type LoginFormState = {
  email: string;
  password: string;
};

export function usePostAuthState() {
  const { token, logout, isHydrated } = useAuthSession();
  const { isOpen, open, close } = useLoginModal();
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: '', password: '' });

  const loginMutation = useMutation({
    mutationFn: async () => {
      try {
        return await login({ email: loginForm.email, password: loginForm.password });
      } catch (error) {
        if (error instanceof Error && error.message === 'Invalid payload') {
          throw new Error('잘못된 계정 정보입니다.');
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      if (!response) return;
      tokenStorage.save(response.token);
      close();
    },
    onError: () => {
      // 에러 메시지는 loginMutation.error에서 소비
    },
  });

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync();
    } catch {
      // 에러는 loginMutation.isError와 errorMessage로 UI에 표시
    }
  };

  return {
    token,
    loginForm,
    setLoginForm,
    isLoginOpen: isOpen,
    openLogin: open,
    closeLogin: close,
    login: handleLogin,
    logout,
    isHydrated,
    loginMutation,
  };
}
