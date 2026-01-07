import type { PostCategory } from '@/entities/post';

export type SortField = 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export type PostFiltersState = {
  search: string;
  category: PostCategory | 'ALL';
  sort: SortField;
  order: SortOrder;
};
