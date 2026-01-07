'use client';

import { FormEvent, useState } from 'react';

import type { Post } from '@/entities/post';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Select, SelectItem } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';

import type { PostFormValues } from '../model/types';
import { validatePostForm } from '../model/validation';

type PostFormProps = {
  initialValues?: Partial<Post>;
  onSubmit: (values: PostFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
};

export function PostForm({
  initialValues,
  onSubmit,
  onCancel,
  submitting,
}: PostFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [body, setBody] = useState(initialValues?.body ?? '');
  const [category, setCategory] = useState<Post['category']>(
    initialValues?.category ?? 'NOTICE',
  );
  const [tagsInput, setTagsInput] = useState(initialValues?.tags?.join(', ') ?? '');
  const [errors, setErrors] = useState<
    Partial<Record<'title' | 'body' | 'category' | 'tagsInput', string[]>>
  >({});

  const renderErrors = (messages?: string[]) => {
    if (!messages?.length) return null;
    return (
      <div className="mt-1 space-y-1 text-xs text-(--danger)">
        {messages.map((message, index) => (
          <p key={`${message}-${index}`}>{message}</p>
        ))}
      </div>
    );
  };

  // 입력값을 검증하고 에러를 반영한 뒤 유효한 값만 반환
  const validate = (): PostFormValues | null => {
    const { values, errors: nextErrors } = validatePostForm({
      title,
      body,
      category,
      tagsInput,
    });

    if (!values) {
      setErrors(nextErrors);
      return null;
    }

    setErrors({});
    return values;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validated = validate();
    if (!validated) return;
    await onSubmit(validated);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-muted">제목</label>
        <Input
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={submitting}
          className="w-full mt-1"
        />
        {renderErrors(errors.title)}
      </div>

      <div>
        <label className="text-sm font-medium text-muted">카테고리</label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as Post['category'])}
          disabled={submitting}
          className="w-full mt-1"
        >
          <SelectItem value="NOTICE">NOTICE</SelectItem>
          <SelectItem value="QNA">QNA</SelectItem>
          <SelectItem value="FREE">FREE</SelectItem>
        </Select>
        {renderErrors(errors.category)}
      </div>

      <div>
        <label className="text-sm font-medium text-muted">본문</label>
        <Textarea
          placeholder="본문을 입력하세요"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          disabled={submitting}
          className="mt-1"
        />
        {renderErrors(errors.body)}
      </div>

      <div>
        <label className="text-sm font-medium text-muted">태그 (쉼표로 구분, 최대 5개)</label>
        <Input
          placeholder="예: react, typescript"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          disabled={submitting}
          className="w-full mt-1"
        />
        {renderErrors(errors.tagsInput)}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
          취소
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
}
