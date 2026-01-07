import type { PostCreateRequest } from '@/entities/post';

import type { PostFormValues } from './types';

// 폼 값 -> API payload 변환 (생성/수정 공통)
export const toPostPayload = (values: PostFormValues): PostCreateRequest => ({
  title: values.title,
  body: values.body,
  category: values.category,
  tags: values.tags,
});
