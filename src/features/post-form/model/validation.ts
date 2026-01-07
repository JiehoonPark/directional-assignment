import {
  BANNED_WORDS,
  POST_BODY_MAX,
  POST_TAG_LENGTH_MAX,
  POST_TAG_MAX,
  POST_TITLE_MAX,
} from '@/shared/config/constants';

import type { PostFormValues } from './types';

type PostFormDraft = {
  title: string;
  body: string;
  category: PostFormValues['category'];
  tagsInput?: string;
};

type PostFormValidationResult = {
  values: PostFormValues | null;
  errors: Partial<Record<keyof PostFormDraft, string[]>> &
    Partial<Record<'tagsInput', string[]>>;
};

const bannedWordsLower = BANNED_WORDS.map((word) => word.toLowerCase());

const parseTags = (tagsInput?: string) =>
  tagsInput
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];

export function validatePostForm(draft: PostFormDraft): PostFormValidationResult {
  const errors: PostFormValidationResult['errors'] = {};
  const trimmedTitle = draft.title.trim();
  const trimmedBody = draft.body.trim();

  // 필드별로 여러 에러를 누적할 수 있도록 배열로 관리
  const pushError = (field: keyof PostFormValidationResult['errors'], message: string) => {
    const current = errors[field] ?? [];
    errors[field] = [...current, message];
  };

  if (!trimmedTitle) {
    pushError('title', '제목을 입력하세요');
  } else if (trimmedTitle.length > POST_TITLE_MAX) {
    pushError('title', `제목은 ${POST_TITLE_MAX}자 이내`);
  }

  if (!trimmedBody) {
    pushError('body', '본문을 입력하세요');
  } else if (trimmedBody.length > POST_BODY_MAX) {
    pushError('body', `본문은 ${POST_BODY_MAX}자 이내`);
  }

  const lowerTitle = trimmedTitle.toLowerCase();
  const lowerBody = trimmedBody.toLowerCase();
  // 제목/본문 금칙어는 각각의 필드에 표시
  const bannedInTitle = lowerTitle
    ? bannedWordsLower.find((word) => lowerTitle.includes(word))
    : undefined;
  if (bannedInTitle) {
    pushError('title', `금칙어 "${bannedInTitle}"가 포함되어 있습니다.`);
  }

  const bannedInBody = lowerBody
    ? bannedWordsLower.find((word) => lowerBody.includes(word))
    : undefined;
  if (bannedInBody) {
    pushError('body', `금칙어 "${bannedInBody}"가 포함되어 있습니다.`);
  }

  const rawTags = parseTags(draft.tagsInput);
  const uniqueTags = Array.from(new Set(rawTags));

  if (uniqueTags.length > POST_TAG_MAX) {
    pushError('tagsInput', `태그는 최대 ${POST_TAG_MAX}개까지`);
  }
  const tooLongTag = uniqueTags.find((tag) => tag.length > POST_TAG_LENGTH_MAX);
  if (tooLongTag) {
    pushError('tagsInput', `태그는 ${POST_TAG_LENGTH_MAX}자 이내로 입력`);
  }

  const lowerTags = uniqueTags.map((tag) => tag.toLowerCase());
  // 태그에 포함된 금칙어 안내 표시
  const bannedInTags = bannedWordsLower.find((word) =>
    lowerTags.some((tag) => tag.includes(word)),
  );
  if (bannedInTags) {
    pushError('tagsInput', `금칙어 "${bannedInTags}"가 포함되어 있습니다.`);
  }

  if (Object.keys(errors).length > 0) {
    return { values: null, errors };
  }

  return {
    values: {
      title: trimmedTitle,
      body: trimmedBody,
      category: draft.category,
      tags: uniqueTags,
      tagsInput: draft.tagsInput,
    },
    errors: {},
  };
}
