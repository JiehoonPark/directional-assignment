import type { PostCategory } from '@/entities/post';

import type { SortField, SortOrder } from '../model/types';

type Option<T> = {
  value: T;
  label: string;
};

export const CATEGORY_OPTIONS: Array<Option<PostCategory | 'ALL'>> = [
  { value: 'ALL', label: '전체' },
  { value: 'NOTICE', label: 'NOTICE' },
  { value: 'QNA', label: 'QNA' },
  { value: 'FREE', label: 'FREE' },
];

export const SORT_OPTIONS: Array<Option<SortField>> = [
  { value: 'createdAt', label: '작성일' },
  { value: 'title', label: '제목' },
];

export const ORDER_OPTIONS: Array<Option<SortOrder>> = [
  { value: 'desc', label: '내림차순' },
  { value: 'asc', label: '오름차순' },
];
