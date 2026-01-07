import type { PostFiltersState } from '../model/types';

export const defaultPostFilters: PostFiltersState = {
  search: '',
  category: 'ALL',
  sort: 'createdAt',
  order: 'desc',
};
