'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { login } from '../api/login';
import { useLoginModal } from '../model/useLoginModal';
import { tokenStorage } from '@/shared/api/tokenStorage';
import { LoginDialog } from './LoginDialog';

type LoginFormState = {
  email: string;
  password: string;
};

const INITIAL_LOGIN_FORM: LoginFormState = {
  email: '',
  password: '',
};

export function LoginDialogContainer() {
  const { isOpen, close } = useLoginModal();
  const [loginForm, setLoginForm] = useState<LoginFormState>(INITIAL_LOGIN_FORM);
  const wasOpenRef = useRef(isOpen);

  const loginMutation = useMutation({
    mutationFn: async () => {
      try {
        return await login({
          email: loginForm.email,
          password: loginForm.password,
        });
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

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      setLoginForm(INITIAL_LOGIN_FORM);
      loginMutation.reset();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, loginMutation]);

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync();
    } catch {
      // 에러는 loginMutation.isError와 errorMessage로 UI에 표시
    }
  };

  const errorMessage =
    loginMutation.isError
      ? (loginMutation.error as Error)?.message ?? '확인해주세요'
      : undefined;

  return (
    <LoginDialog
      open={isOpen}
      onClose={close}
      email={loginForm.email}
      password={loginForm.password}
      onEmailChange={(value) =>
        setLoginForm((previousForm) => ({ ...previousForm, email: value }))
      }
      onPasswordChange={(value) =>
        setLoginForm((previousForm) => ({ ...previousForm, password: value }))
      }
      onSubmit={handleLogin}
      isSubmitting={loginMutation.isPending}
      errorMessage={errorMessage}
    />
  );
}
