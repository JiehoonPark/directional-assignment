import type { Post } from '@/entities/post';

export type PostFormValues = {
  title: string;
  body: string;
  category: Post['category'];
  tags: string[];
  tagsInput?: string;
};
