'use client';

import { memo } from 'react';

import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';

type LoginDialogProps = {
  open: boolean;
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
};

function LoginDialogComponent({
  open,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
  isSubmitting,
  errorMessage,
}: LoginDialogProps) {
  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="로그인"
      description="내 게시글 모드에서 작성/수정/삭제 시 필요합니다."
    >
      <div className="space-y-3">
        <div>
          <label className="text-sm text-muted">이메일</label>
          <Input
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="z1hoon715@gmail.com"
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-sm text-muted">비밀번호</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            className="mt-1 w-full"
          />
        </div>
        <div className="min-h-5 text-sm text-(--danger)">
          {errorMessage ?? ''}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export const LoginDialog = memo(LoginDialogComponent);
